import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useConfigStore } from '../../stores/configStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { configFields, configFieldsDynamic } from '../../utils/fields/configFields';
import { generateSlug } from '../../utils/helper';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';
import type { FieldConfig } from '../../types/common';

type ConfigFormData = {
  name: string;
  slug: string;
  status?: boolean;
  configFields: Array<{ key: string; value: string }>;
};

const getNestedError = (errors: any, path: string): any => {
  return path.split('.').reduce((acc: any, part: string) => {
    return acc && part in acc ? acc[part] : undefined;
  }, errors);
};

const ConfigFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchConfigById, addConfig, updateConfig } = useConfigStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const methods = useForm<ConfigFormData>({
    defaultValues: {
      name: '',
      slug: '',
      status: true,
      configFields: [{ key: '', value: '' }],
    },
    mode: 'onSubmit',
  });

  const { handleSubmit, reset, setError, clearErrors, formState: { errors, isSubmitting }, setValue } = methods;

  // Use dynamic field config from utils
  const dynamicFieldConfig: FieldConfig[] = configFieldsDynamic;

  // Prepare fields: for edit, make name and slug read-only
  // For add: disable slug if it has a value (auto-generated)
  const fields = configFields.map(field => {
    if (id && (field.name === 'name' || field.name === 'slug')) {
      return { ...field, readOnly: true, disabled: true };
    }
    if (field.name === 'slug') {
      const slugValue = methods.watch('slug');
      return {
        ...field,
        readOnly: !!slugValue,
        disabled: !!slugValue,
      };
    }
    return field;
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (id) {
        try {
          // Force refetch by adding timestamp to avoid cache
          const config = await fetchConfigById(id + '?_=' + new Date().getTime());
          if (config) {
            // Clear form first
            reset({
              name: '',
              slug: '',
              status: true,
              configFields: [{ key: '', value: '' }]
            });

            // Ensure configFields is properly formatted
            const formattedConfigFields = Array.isArray(config.configFields) 
              ? config.configFields.map(field => ({
                  key: field.key || '',
                  value: field.value || ''
                }))
              : [{ key: '', value: '' }];

            // Set new values with a slight delay to ensure clean state
            setTimeout(() => {
              reset({
                name: config.name || '',
                slug: config.slug || '',
                status: !!config.status,
                configFields: formattedConfigFields.length > 0 
                  ? formattedConfigFields 
                  : [{ key: '', value: '' }]
              }, { keepDirty: false, keepValues: false });

              // Log the form data for debugging
              console.log('Form Data:', {
                name: config.name,
                slug: config.slug,
                status: !!config.status,
                configFields: formattedConfigFields
              });
            }, 0);
          }
          setIsInitialized(true);
        } catch (error: any) {
          console.error('Error loading config:', error);
          toast.error(error?.response?.data?.message || error?.message || 'Failed to load config');
          setIsInitialized(true);
          navigate('/config');
        }
      } else {
        setIsInitialized(true);
      }
    };
    initializeForm();
  }, [id, reset, fetchConfigById, navigate]);

  const handleFieldChange = (fieldName: keyof ConfigFormData, minLengthValue?: number) => (e: { target: { name: string; value: any; checked?: boolean } }) => {
    let value = e.target.value;
    if (fieldName === 'status' && typeof e.target.checked === 'boolean') {
      value = e.target.checked;
    }
    // Auto-generate slug from name if fieldName is 'name' and not editing
    if (fieldName === 'name' && !id) {
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
      setError(fieldName as any, { type: 'manual', message: errorsArr[0].message });
    } else {
      clearErrors(fieldName as any);
    }
    setValue(fieldName as any, value, { shouldValidate: true });
  };

  const onSubmit = async (data: ConfigFormData) => {
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      slug: data.slug.trim(),
      status: !!data.status,
      configFields: data.configFields.map(cf => ({
        key: cf.key.trim(),
        value: cf.value.trim()
      })).filter(cf => cf.key && cf.value),
    };

    // Log the submission data for debugging
    console.log('Submitting data:', trimmedData);

    if (id && trimmedData.configFields.length === 0) {
      toast.error('At least one config field is required');
      return;
    }

    try {
      if (id) {
        await updateConfig(id, trimmedData);
        // Force a reset of the form state
        reset();
        await Swal.fire({
          title: 'Success!',
          text: 'Config updated successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      } else {
        await addConfig(trimmedData);
        await Swal.fire({
          title: 'Success!',
          text: 'Config added successfully',
          icon: 'success',
          confirmButtonColor: 'var(--puprle-color)',
        });
      }
      // Clear any cached values before navigating
      reset();
      navigate('/config');
    } catch (error: any) {
      let errorMessage = 'Something went wrong';

      // Handle different error types
      if (typeof error === 'string') {
        // Error thrown as string from store
        errorMessage = error;
      } else if (error?.response?.data?.message) {
        // Axios error with backend message
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 409 && error?.response?.data?.message?.includes('already exists')) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map((err: { path: string; message: string }) => `${err.path}: ${err.message}`).join('\n');
      } else if (error?.message) {
        errorMessage = error.message;
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: 'var(--puprle-color)',
      });
    }
  };

  const hasErrors = () => {
    return configFields.some(field => {
      const error = getNestedError(errors, field.name);
      return error?.message !== undefined;
    });
  };

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <FormHeader
        managementName="Config"
        addButtonLink="/config"
        type={id ? 'Edit' : 'Add'}
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label={id ? 'Update' : 'Save'}
          fields={fields}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="config-form"
          isDynamic={!!id}
          dynamicFieldName="configFields"
          dynamicFieldConfig={dynamicFieldConfig}
          onFieldChange={{
            name: handleFieldChange('name'),
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

export default ConfigFormTemplate;