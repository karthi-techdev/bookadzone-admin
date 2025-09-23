import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import { useBlogCategoryStore } from '../../stores/blogCategoryStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { blogFields } from '../../utils/fields/blogCategory';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';
import type {BlogCategory}from '../../types/common';

type BlogCategoryFormData = {
  name: string;
  status?: boolean;
 
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const BlogCategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBlogCategoryById, addBlogCategory, updateBlogCategory } = useBlogCategoryStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<BlogCategoryFormData>({
    defaultValues: {
      name: '',
      status: true,
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (name: keyof BlogCategoryFormData, minLengthValue?: number, maxValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
    let value = e.target.value;
    if (typeof methods.getValues(name) === 'boolean' && typeof e.target.checked === 'boolean') {
      value = e.target.checked;
    } 

    // Build validation rules for this field
    const validations = [
      ValidationHelper.isRequired(value, name.charAt(0).toUpperCase() + name.slice(1)),
    ];
    if (minLengthValue && typeof value === 'string') {
      validations.push(ValidationHelper.minLength(value, name.charAt(0).toUpperCase() + name.slice(1), minLengthValue));
    }
    if (maxValue && typeof value === 'number') {
      validations.push(ValidationHelper.maxValue(value, name.charAt(0).toUpperCase() + name.slice(1), maxValue));
    }

    const errorsArr = ValidationHelper.validate(validations);
    if (errorsArr.length > 0) {
      setError(name, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(name);
    }
    methods.setValue(name, value, { shouldValidate: false });
  };

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const blogCategory = await fetchBlogCategoryById(id);
        if (blogCategory) {
          reset({
            name: blogCategory.name || '',
            status: typeof blogCategory.status === 'boolean' ? blogCategory.status : blogCategory.status === 'active',
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load FAQ data');
        }
      };
      fetchData();
    }
  }, [id, fetchBlogCategoryById, reset, isInitialized]);

  const onSubmit = async (data: BlogCategoryFormData) => {
    clearErrors();

    const trimmedData : BlogCategory = {
      name: data.name.trim(),
      status: data.status,
      label: data.name.trim(), // or provide appropriate value
    };

    

    // Frontend validation
    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(trimmedData.name, 'Name'),
      ValidationHelper.minLength(trimmedData.name, 'Name', 5),
      ValidationHelper.maxLength(trimmedData.name, 'Name', 500),
      
      ValidationHelper.isValidEnum(
        typeof trimmedData.status === 'boolean' ? (trimmedData.status ? 'active' : 'inactive') : trimmedData.status,
        'Status',
        ['active', 'inactive']
      ),
     
    ]);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field.toLowerCase() as keyof BlogCategoryFormData;
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
      if (id) {
        await updateBlogCategory(id, trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'FAQ updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addBlogCategory(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'FAQ added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/blogCategory');
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
    return blogFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Blog"
        addButtonLink="/blogCategory"
        type={id ? 'Edit' : 'Add'}
      />
       <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={blogFields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="blogCategory-form"
          onFieldChange={{
            name: handleFieldChange('name', 5),
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

export default BlogCategoryFormTemplate;