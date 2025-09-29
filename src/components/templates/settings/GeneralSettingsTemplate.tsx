import React from 'react';
import ValidationHelper from '../../utils/validationHelper';
import { useFormContext } from 'react-hook-form';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { generalSettingsFields } from '../../utils/fields/generalSettingsFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

type GeneralSettingsFormValues = {
  [key: string]: any;
};

const GeneralSettingsTemplate: React.FC = () => {
  const methods = useForm<GeneralSettingsFormValues>({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, setError, clearErrors, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore((state: any) => state.fetchSettings);
  const settings = useSettingsStore((state: any) => state.settings);
  const loading = useSettingsStore((state: any) => state.loading);
  const updateSettings = useSettingsStore((state: any) => state.updateSettings);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.general) {
      reset(settings.general);
    }
  }, [settings, reset]);

  // Validation logic for a single field
  const validateField = (field: any, value: any) => {
    let error = null;
    // Image validation: required only if no existing file in edit mode
    if (field.required) {
      if (field.type === 'file') {
        // If the file input sent a special invalid value, always show error
        // if (value === '__invalid_file_type__') {
        //   return { field: field.name, message: `${field.label} must be of type: ${field.accept}` };
        // }
        // If editing and existing file is present, skip required validation
        if (settings?.general && settings.general[field.name]) {
          if (!value) return null;
        }
        error = ValidationHelper.isRequired(value, field.name);
        // File type validation
        if (!error && field.accept) {
          error = ValidationHelper.isValidFileType(value, field.name, field.accept);
        }
      } else {
        error = ValidationHelper.isRequired(value, field.name);
      }
    }
    if (!error && field.minLength) {
      error = ValidationHelper.minLength(value, field.name, field.minLength);
    }
    if (!error && field.maxLength) {
      error = ValidationHelper.maxLength(value, field.name, field.maxLength);
    }
    if (!error && Array.isArray(field.options)) {
      const allowedValues = field.options.map((opt: any) => opt.value);
      error = ValidationHelper.isValidEnum(value, field.name, allowedValues);
    }
    return error;
  };

  // Handle field change and validate
  const { setValue } = methods;
  const handleFieldChange = (field: any, value: any) => {
    setValue(field.name, value, { shouldValidate: true });
    const error = validateField(field, value);
    if (error) {
      setError(field.name, { type: 'manual', message: error.message });
    } else {
      clearErrors(field.name);
    }
  };

  const onSubmit = async (formData: any) => {
    clearErrors();
    // Collect validation errors using ValidationHelper
    const validationErrors = generalSettingsFields.map(field => {
      const value = formData[field.name];
      return validateField(field, value);
    }).filter(e => e);

    if (validationErrors.length > 0) {
      // Set errors in react-hook-form
      validationErrors.forEach(err => {
        if (err) {
          setError(err.field as any, { type: 'manual', message: err.message });
        }
      });
      toast.error('Please fix validation errors');
      return;
    }

    try {
      const formDataObj = new FormData();
      generalSettingsFields.forEach(field => {
        const value = formData[field.name];
        if (field.type === 'file') {
          if (value instanceof File) {
            formDataObj.append(field.name, value);
          } else if (typeof value === 'string') {
            formDataObj.append(field.name, value);
          }
        } else {
          formDataObj.append(field.name, value ?? '');
        }
      });
      await updateSettings(formDataObj);
      toast.success('General settings updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName=" General Settings"
      />      
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={generalSettingsFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="general-settings-form"
          existingFiles={{
            siteLogo: settings?.general?.siteLogo ?? '',
            favicon: settings?.general?.favicon ?? '',
          }}
          onFieldChange={Object.fromEntries(
            generalSettingsFields.map(field => [
              field.name,
              (e: { target: { value: any } }) => handleFieldChange(field, e.target.value)
            ])
          )}
        />
      </FormProvider>
    </div>
  );
};

export default GeneralSettingsTemplate;
