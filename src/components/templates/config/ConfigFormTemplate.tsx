import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useConfigStore } from '../../stores/configStore';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';
import { configFields } from '../../utils/fields/configFields';
import { generateSlug } from '../../utils/helper';
import ValidationHelper from '../../utils/validationHelper';
import Swal from 'sweetalert2';
import type { FieldConfig } from '../../types/common';

type ConfigFormData = {
  name: string;
  slug: string;
  status?: boolean;
  configFields: { key: string; value: string }[];
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

  const dynamicFieldConfig: FieldConfig[] = [
    { name: 'key', label: 'Key', type: 'text', required: true, placeholder: 'Enter key' },
    { name: 'value', label: 'Value', type: 'text', required: true, placeholder: 'Enter value' },
  ];

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
          const config = await fetchConfigById(id);
          if (config) {
            reset({
              name: config.name,
              slug: config.slug,
              status: config.status !== undefined ? config.status : true,
              configFields: config.configFields && config.configFields.length > 0 
                ? config.configFields 
                : [{ key: '', value: '' }],
            });
          }
          setIsInitialized(true);
        } catch (error) {
          toast.error('Failed to load config');
          setIsInitialized(true);
        }
      } else {
        setIsInitialized(true);
      }
    };
    initializeForm();
  }, [id, reset, fetchConfigById]);

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
      configFields: data.configFields.map(cf => ({
        key: cf.key.trim(),
        value: cf.value.trim()
      })).filter(cf => cf.key && cf.value),
    };

    if (id && trimmedData.configFields.length === 0) {
      toast.error('At least one config field is required');
      return;
    }

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
          onNameClick={{
            name: handleFieldChange('name', 3),
            slug: handleFieldChange('slug', 3),
            status: handleFieldChange('status'),
          }}
          isDynamic={!!id}
          dynamicFieldName="configFields"
          dynamicFieldConfig={dynamicFieldConfig}
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