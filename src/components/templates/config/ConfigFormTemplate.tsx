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

  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
    setValue,
  } = methods;

  const dynamicFieldConfig: FieldConfig[] = configFieldsDynamic;

  // Prepare fields
  const fields = configFields.map(field => {
    if (id && (field.name === 'name' || field.name === 'slug')) {
      return { ...field, readOnly: true, disabled: true };
    }
    if (field.name === 'slug') {
      const slugValue = methods.watch('slug');
      return { ...field, readOnly: !!slugValue, disabled: !!slugValue };
    }
    return field;
  });

  // Fetch data when editing
  useEffect(() => {
    const initializeForm = async () => {
      if (id) {
        try {
          const config = await fetchConfigById(id + '?_=' + new Date().getTime());
          if (config) {
            const formattedFields = Array.isArray(config.configFields)
              ? config.configFields.map(f => ({
                  key: f.key || '',
                  value: f.value || '',
                }))
              : [{ key: '', value: '' }];

            reset({
              name: config.name || '',
              slug: config.slug || '',
              status: !!config.status,
              configFields: formattedFields.length > 0 ? formattedFields : [{ key: '', value: '' }],
            });
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

  // Field change handler
  const handleFieldChange = (fieldName: keyof ConfigFormData, minLengthValue?: number) => 
    (e: { target: { value: any; checked?: boolean } }) => {
      let value = e.target.value;
      if (fieldName === 'status' && typeof e.target.checked === 'boolean') {
        value = e.target.checked;
      }

      // Auto-slug
      if (fieldName === 'name' && !id) {
        const slugValue = generateSlug(value);
        setValue('slug', slugValue, { shouldValidate: true });
      }

      // Frontend validations
      const validations = [
        ValidationHelper.isRequired(value, fieldName),
        minLengthValue && typeof value === 'string'
          ? ValidationHelper.minLength(value, fieldName, minLengthValue)
          : null,
      ].filter(Boolean);

      const error = validations.find(v => v !== null);
      if (error) {
        setError(fieldName as any, { type: 'manual', message: error.message });
      } else {
        clearErrors(fieldName as any);
      }

      setValue(fieldName as any, value, { shouldValidate: true });
    };

 const onSubmit = async (data: ConfigFormData) => {
  clearErrors();

  const trimmedData = {
    ...data,
    name: data.name.trim(),
    slug: data.slug.trim(),
    status: !!data.status,
    configFields: data.configFields
      .map(cf => ({ key: cf.key.trim(), value: cf.value.trim() }))
      .filter(cf => cf.key && cf.value),
  };

  // Frontend Validation (same pattern as BlogCategory)
  const validations: any[] = [];

  // Name validations
  validations.push(ValidationHelper.isRequired(trimmedData.name, 'Name'));
  if (trimmedData.name) {
    validations.push(ValidationHelper.minLength(trimmedData.name, 'Name', 3));
    validations.push(ValidationHelper.maxLength(trimmedData.name, 'Name', 50));
  }

  // Slug validations
  validations.push(ValidationHelper.isRequired(trimmedData.slug, 'Slug'));
  if (trimmedData.slug) {
    validations.push(ValidationHelper.minLength(trimmedData.slug, 'Slug', 3));
    validations.push(ValidationHelper.maxLength(trimmedData.slug, 'Slug', 50));
  }

  // ConfigFields validation
  if (!trimmedData.configFields.length) {
    validations.push({
      field: 'configFields',
      message: 'At least one config field is required',
    });
  }

  // Status validation
  validations.push(
    ValidationHelper.isValidEnum(
      trimmedData.status ? 'active' : 'inactive',
      'Status',
      ['active', 'inactive']
    )
  );

  const validationErrors = ValidationHelper.validate(validations.filter(Boolean));

  if (validationErrors.length > 0) {
    validationErrors.forEach((err: any) => {
      const fieldName = err.field.toLowerCase() as keyof ConfigFormData;
      setError(fieldName, {
        type: 'manual',
        message: err.message,
      });
    });
    return; // stop here, don’t call API
  }

  // ✅ Only reach here if frontend validation passed
  try {
    if (id) {
      await updateConfig(id, trimmedData);
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
    navigate('/config');
  } catch (error: any) {
    const errorData = error?.response?.data || {};

    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err: { path: string; message: string }) => {
        const fieldPath = err.path.replace(/\[(\d+)\]/g, '.$1');
        setError(fieldPath as any, { type: 'server', message: err.message });
      });
      return;
    }

    if (error?.response?.status === 409 && errorData.message?.includes('already exists')) {
      if (errorData.message.toLowerCase().includes('name')) {
        setError('name', { type: 'server', message: errorData.message });
      } else if (errorData.message.toLowerCase().includes('slug')) {
        setError('slug', { type: 'server', message: errorData.message });
      } else {
        toast.error(errorData.message);
      }
      return;
    }

    toast.error(errorData.message || error?.message || 'Something went wrong');
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
