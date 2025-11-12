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

  // ---------- handleFieldChange ----------
const handleFieldChange = (fieldName: keyof NewsLetterFormData, minLength?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
  let rawValue = e.target.value;
  if (fieldName === 'status' && typeof e.target.checked === 'boolean') {
    rawValue = e.target.checked;
  }

  const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

  // Auto-generate slug when typing name (only on Add, not Edit)
  if (fieldName === 'name' && !id) {
    const slugValue = generateSlug(rawValue);
    setValue('slug', slugValue, { shouldValidate: true });
  }

  // NOTE: do NOT try to return input props from here. Mark slug readOnly/disabled at the form field config.
  const field = newsLetterFields.find(f => f.name === fieldName);
  if (!field) return;

  const validations = [] as any[];

  // Required should consider trimmed value to avoid showing secondary validations first
  if (field.required) {
    const requiredError = ValidationHelper.isRequired(valueForValidation, fieldName);
    if (requiredError) {
      setError(fieldName, {
        type: 'manual',
        message: requiredError.message,
      });
      setValue(fieldName, rawValue, { shouldValidate: false });
      return;
    }
  }

  if (valueForValidation) {
    if (minLength && typeof valueForValidation === 'string') {
      validations.push(ValidationHelper.minLength(valueForValidation, fieldName, minLength));
    }
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

  setValue(fieldName, rawValue, { shouldValidate: false });
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

 // ---------- onSubmit ----------
const onSubmit = async (data: NewsLetterFormData) => {
  clearErrors();

  // Normalize values (trim strings) so required takes precedence over minLength/format
  const d = normalizeFormValues(data);

  

  // First validate all form fields with precedence: required > other rules
  const validations: any[] = [];
  validations.push(ValidationHelper.isRequired(d.name, 'name'));
  if (d.name) validations.push(ValidationHelper.minLength(d.name, 'name', 5));
  if (d.name) validations.push(ValidationHelper.maxLength(d.name, 'name', 500));

  // <-- Add slug required validation here -->
  validations.push(ValidationHelper.isRequired(d.slug, 'slug'));
  if (d.slug) validations.push(ValidationHelper.minLength(d.slug, 'slug', 3));

  validations.push(ValidationHelper.isRequired(d.template, 'template'));

  // Use lowercase 'status' as the field so setError maps correctly
  validations.push(ValidationHelper.isValidEnum(
    typeof d.status === 'boolean' ? (d.status ? 'active' : 'inactive') : d.status,
    'status',
    ['active', 'inactive']
  ));

  const validationErrors = ValidationHelper.validate(validations);

  if (validationErrors.length > 0) {
    // Only set the first error per field so required errors are not overridden
    const seen = new Set<string>();
    for (const err of validationErrors) {
      const fieldName = err.field as keyof NewsLetterFormData;
      const key = String(err.field);
      if (seen.has(key)) continue;
      seen.add(key);
      setError(fieldName, {
        type: 'manual',
        message: err.message,
      });
    }

    // <-- REMOVE the toast here so only field-level messages are shown. -->
    // toast.error('Please fix all validation errors');
    return;
  }

  try {
    if (id) {
      await updateNewsLetter(id, d);
      await Swal.fire({
        title: 'Success!',
        text: 'NewsLetter updated successfully',
        icon: 'success',
        confirmButtonColor: 'var(--puprle-color)',
      });
    } else {
      await addNewsLetter(d);
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

    // Keep server-side toasts (conflict/duplication) but avoid toast on client validation
    if (error?.response?.status === 409 && errorData.message?.includes('already exists')) {
      toast.error(errorData.message);
      return;
    }

    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: { path: string; message: string }) => {
        // set field errors for server-side validation if possible
        if (err.path) {
          setError(err.path as any, { type: 'server', message: err.message });
        } else {
          toast.error(`${err.path}: ${err.message}`);
        }
      });
      return;
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


  // Normalize values to trim strings
  const normalizeFormValues = (values: NewsLetterFormData): NewsLetterFormData => {
    const normalized: any = {};
    Object.entries(values).forEach(([k, v]) => {
      normalized[k] = typeof v === 'string' ? v.trim() : v;
    });
    return normalized as NewsLetterFormData;
  };

  // Ensure onSubmit-like validation runs even if RHF has existing field errors
  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
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
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          data-testid="NewsLetter-form"
          onFieldChange={{
            name: handleFieldChange('name', 5),
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