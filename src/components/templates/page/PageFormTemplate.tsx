import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { usePageStore } from '../../stores/PageStore';
import { useConfigStore } from '../../stores/configStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { pageFields } from '../../utils/fields/pageFields';
import ValidationHelper from '../../utils/validationHelper';
import { generateSlug } from '../../utils/helper';
import Swal from 'sweetalert2';

type PageFormData = {
  title: string;
  name: string;
  slug: string;
  type: 'link' | 'template';
  url?: string;
  template?: string;
  status: 'active' | 'inactive';
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const PageFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPageById, addPage, updatePage } = usePageStore();
  const { fetchPageConfigFields, pageConfigFields } = useConfigStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [configOptions, setConfigOptions] = useState<{ value: string; label: string }[]>([]);

  const methods = useForm<PageFormData>({
    defaultValues: {
      title: '',
      name: '',
      slug: '',
      type: 'link',
      url: '',
      template: '',
      status: 'active',
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting }, setValue, control } = methods;

  const watchedType = useWatch({ control, name: 'type' });

  // Fetch configs for title options
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        await fetchPageConfigFields();
      } catch (error) {
        toast.error('Failed to load config options');
      }
    };
    loadConfigs();
  }, [fetchPageConfigFields]);

  // Set options when pageConfigFields changes
  useEffect(() => {
    const options = pageConfigFields.map(field => ({ value: field.key, label: field.value }));
    setConfigOptions(options);
  }, [pageConfigFields]);

  // Update fields with config options
  const fieldsWithOptions = pageFields.map(field => {
    if (field.name === 'title') {
      return { ...field, options: configOptions };
    }
    return field;
  });

  // Conditional fields based on type
  const PagesFields = fieldsWithOptions.filter(field => {
    if (field.name === 'url') return watchedType === 'link';
    if (field.name === 'template') return watchedType === 'template';
    return true;
  });

  const handleFieldChange = (fieldName: keyof PageFormData, minLengthValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
    let value = e.target.value;

    // Auto-generate slug when typing name (only on Add, not Edit)
    if (fieldName === 'name') {
      const slugValue = generateSlug(value);
      setValue('slug', slugValue, { shouldValidate: true });
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
        const page = await fetchPageById(id);
        if (page) {
      reset({
        title: page.title || '',
        name: page.name || '',
        slug: page.slug || '',
        type: page.type || 'link',
        url: page.url || '',
        template: page.description || '',
        status: page.status || 'active',
      });
          setIsInitialized(true);
        } else {
          toast.error('Failed to load page data');
        }
      };
      fetchData();
    }
  }, [id, fetchPageById, reset, isInitialized]);

  const onSubmit = async (data: PageFormData) => {
    clearErrors();

    const trimmedData = {
      ...data,
      name: data.name.trim(),
      slug: data.slug.trim(),
    };

    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(trimmedData.title, 'Title'),
      ValidationHelper.isRequired(trimmedData.name, 'Name'),
      ValidationHelper.minLength(trimmedData.name, 'Name', 5),
      ValidationHelper.maxLength(trimmedData.name, 'Name', 500),
      ValidationHelper.isValidEnum(trimmedData.type, 'Type', ['link', 'template']),
      ...(trimmedData.type === 'link' ? [ValidationHelper.isRequired(trimmedData.url, 'URL')] : []),
      ...(trimmedData.type === 'template' ? [ValidationHelper.isRequired(trimmedData.template, 'Template')] : []),
      ValidationHelper.isValidEnum(trimmedData.status, 'Status', ['active', 'inactive']),
    ]);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        const fieldName = err.field.toLowerCase() as keyof PageFormData;
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      });
      return;
    }

    try {
      if (id) {
        await updatePage(id, trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'Page updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addPage(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'Page added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      navigate('/page');
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
    return PagesFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Page"
        addButtonLink="/page"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={PagesFields}
          isSubmitting={isSubmitting}
        isJodit={watchedType === 'template'}
        managementName="Page"
        onSubmit={handleSubmit(onSubmit)}
        data-testid="Page-form"
        onFieldChange={{
          title: handleFieldChange('title', 3),
          name: handleFieldChange('name', 3),
          slug: handleFieldChange('slug', 3),
          type: handleFieldChange('type'),
          url: handleFieldChange('url'),
          template: handleFieldChange('template'),
          status: handleFieldChange('status'),
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

export default PageFormTemplate;
