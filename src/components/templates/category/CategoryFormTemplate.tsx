import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useCategoryStore } from '../../stores/categoryStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { CategoryFields } from '../../utils/fields/categoryfield';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';

type CategoryFormData = {
  name: string;
  slug: string;
  isFeatured?: boolean;
  description: string;
  photo?: string | File | (string | File)[];
  // priority?: number; // Add this line if 'priority' is needed elsewhere in the form
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const CategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCategoryById, addCategory, updateCategory } = useCategoryStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      slug: '',
      isFeatured: true,
      description: '',
      photo: '',
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof CategoryFormData, minLengthValue?: number, maxValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {

    let value = e.target.value;

    if (typeof methods.getValues(fieldName) === 'boolean' && typeof e.target.checked === 'boolean') {
      value = e.target.checked;
    } else if (fieldName === 'name') {
      value = e.target.value;  // keep as string ✅
    }

    // Build validation rules for this field
    const validations = [
      ValidationHelper.isRequired(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1)),
    ];
    if (minLengthValue && typeof value === 'string') {
      validations.push(ValidationHelper.minLength(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), minLengthValue));
    }
    if (maxValue && typeof value === 'number') {
      validations.push(ValidationHelper.maxValue(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), maxValue));
    }

    const errorsArr = ValidationHelper.validate(validations);
    if (errorsArr.length > 0) {
      setError(fieldName, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(fieldName);
    }
    if (fieldName === 'name') {
      methods.setValue('slug', value.replaceAll(" ", "-").toLowerCase(), { shouldValidate: false });
    }
    methods.setValue(fieldName, value, { shouldValidate: false });

  };

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const category = await fetchCategoryById(id);
        if (category) {
          reset({
            name: category.name || '',
            slug: category.slug || '',
            description: category.description || '',
            // photo: category.photo || '',


            isFeatured: typeof category.isFeatured === 'boolean' ? category.isFeatured : category.isFeatured === 'active',
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load CATEGORY data');
        }
      };
      fetchData();
    }
  }, [id, fetchCategoryById, reset, isInitialized]);

const onSubmit = async (data: CategoryFormData) => {
  clearErrors();

  // Prepare trimmed data object matching Category type
  const trimmedData = {
    name: data.name.trim(),
    slug: data.slug.trim(),
    description: data.description?.trim() ?? "",
    photo: data.photo,
    isFeatured: data.isFeatured ?? false,
    length: 0, // or set as needed for your Category type
  };


    // Frontend validation
    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(trimmedData.name, 'name'),
      ValidationHelper.minLength(trimmedData.name, 'name', 5),
      ValidationHelper.maxLength(trimmedData.name, 'name', 500),

      ValidationHelper.isRequired(trimmedData.description, 'description'),
      ValidationHelper.minLength(trimmedData.description, 'description', 5),
      ValidationHelper.maxLength(trimmedData.description, 'description', 2000),

      ValidationHelper.isRequired(trimmedData.isFeatured, 'isFeatured'),

      ValidationHelper.isValidEnum(
        typeof trimmedData.isFeatured === 'boolean' ? (trimmedData.isFeatured ? 'active' : 'inactive') : trimmedData.isFeatured,
        'Status',
        ['active', 'inactive']
      ),

      ValidationHelper.isRequired(trimmedData.photo, 'photo'),
     
    ].filter(Boolean));
    console.log("validationErrors ", validationErrors);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field?.toLowerCase() as keyof CategoryFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      });
      // Only show the first error in toast for clarity
      // toast.error(validationErrors[0].message);
      return;
    }

    // Only reach here if frontend validation passes
    try {
      // Convert trimmedData to FormData
      const formData = new FormData();
      formData.append('name', trimmedData.name);
      formData.append('slug', trimmedData.slug);
      formData.append('description', trimmedData.description);
      formData.append('isFeatured', String(trimmedData.isFeatured));
      formData.append('length', String(trimmedData.length));
      if (trimmedData.photo) {
        if (Array.isArray(trimmedData.photo)) {
          trimmedData.photo.forEach((file, idx) => {
            formData.append('photo', file as Blob);
          });
        } else {
          formData.append('photo', trimmedData.photo as Blob);
        }
      }

      if (id) {
        await updateCategory(id, formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Category updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addCategory(formData);
        await Swal.fire({
          title: 'Success!',
          text: 'Category added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/category');
    } catch (error: any) {
      // Show backend errors only in toast, do not set as field errors
      const errorData = error?.response?.data || {};
      if (error?.response?.status === 409 && errorData.message?.includes('already exists')) {
        toast.error(errorData.message);
        return;
      }
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err: { path: string; message: string }) => {
          toast.error(`${err.path}: ${err.message}`);
        });
      } else if (typeof error === 'string') {
        toast.error(error);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        const message = errorData.message || 'Something went wrong';
        toast.error(message);
      }
    }
  };

  const hasErrors = () => {
    return CategoryFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Category"
        addButtonLink="/category"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={CategoryFields}
          isSubmitting={methods.formState.isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="category-form"
          onFieldChange={{
            name: handleFieldChange('name', 5),
            slug: handleFieldChange('slug', 5),
            // priority: handleFieldChange('priority', undefined, 100),
          }}
        />
        {hasErrors() && (
          <div className="text-red-500 text-sm mt-2">
            Please fix the errors before proceeding.
          </div>
        )}
      </FormProvider>
    </div>
  );
};

export default CategoryFormTemplate;