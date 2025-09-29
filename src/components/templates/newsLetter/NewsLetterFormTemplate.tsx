import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNewsLetterStore } from '../../stores/NewsLetterStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { newsLetterFields } from '../../utils/fields/newsLetterFields';
import ValidationHelper from '../../utils/validationHelper';
import { generateSlug } from '../../utils/helper';
import Swal from 'sweetalert2';

type NewsLetterFormData = {
  name: string;
  slug: string;
  template: string;
  status?: boolean;
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const NewsLetterFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNewsLetterById, addNewsLetter, updateNewsLetter } = useNewsLetterStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<NewsLetterFormData>({
    defaultValues: {
      name: '',
      slug: '',
      template: "",
      status: true,
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting }, setValue } = methods;

  const handleFieldChange = (fieldName: keyof NewsLetterFormData, minLengthValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
    let value = e.target.value;
    if (fieldName === 'status' && typeof e.target.checked === 'boolean') {
      value = e.target.checked;
    }

    // Auto-generate slug when typing name (only on Add, not Edit)
    if (fieldName === 'name') {
      const slugValue = generateSlug(value);
      setValue('slug', slugValue, { shouldValidate: true });
    }
    if(fieldName === 'slug'){
      //  return { ...fieldName, readOnly: true, disabled: true };
      return {readOnly: true,disabled: true}
    }
    
    const validations = [
      ValidationHelper.isRequired(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1)),
      minLengthValue && typeof value === 'string'
        ? ValidationHelper.minLength(value, fieldName.charAt(0).toUpperCase() + fieldName.slice(1), minLengthValue)
        : null,
    ].filter(Boolean) as any[];

    const errorsArr = ValidationHelper.validate(validations);
    if (errorsArr.length > 0) {
      setError(fieldName, { type: 'manual', message: errorsArr[0].message });
    } else {
      clearErrors(fieldName);
    }
    setValue(fieldName, value, { shouldValidate: true });
  };

  useEffect(() => {
    if (id && !isInitialized) {
      const fetchData = async () => {
        const newsLetter = await fetchNewsLetterById(id);
        if (newsLetter) {
          reset({
            name: newsLetter.name || '',
            slug: newsLetter.slug || '',
            status: typeof newsLetter.status === 'boolean' ? newsLetter.status : newsLetter.status === 'active',
            template: newsLetter.template || "",
          });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load newsletter data');
        }
      };
      fetchData();
    }
  }, [id, fetchNewsLetterById, reset, isInitialized]);

  const onSubmit = async (data: NewsLetterFormData) => {
    clearErrors();

    const trimmedData = {
      ...data,
      name: data.name.trim(),
      slug: data.slug.trim(),
    };
const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(trimmedData.name, 'Name'),
      ValidationHelper.minLength(trimmedData.name, 'Name', 5),
      ValidationHelper.maxLength(trimmedData.name, 'Name', 500),
      ValidationHelper.isRequired(trimmedData.template, 'Template'),
      ValidationHelper.isValidEnum(
        typeof trimmedData.status === 'boolean' ? (trimmedData.status ? 'active' : 'inactive') : trimmedData.status,
        'Status',
        ['active', 'inactive']
      ),
    ]);
     if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field.toLowerCase() as keyof NewsLetterFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      });
      return;
    }
    try {
      if (id) {
        await updateNewsLetter(id, trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'NewsLetter updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addNewsLetter(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'NewsLetter added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/newsletter');
    } catch (error: any) {
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
    return newsLetterFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="NewsLetter"
        addButtonLink="/newsletter"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={newsLetterFields}
          isSubmitting={isSubmitting}
          isJodit={true}
          managementName="NewsLetter"
          onSubmit={handleSubmit(onSubmit)}
          data-testid="NewsLetter-form"
          onFieldChange={{
            name: handleFieldChange('name', 3),
            slug: handleFieldChange('slug', 3),
            template: handleFieldChange('template'),
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

export default NewsLetterFormTemplate;
