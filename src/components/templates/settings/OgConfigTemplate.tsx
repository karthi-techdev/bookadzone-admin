import React from 'react';
import ValidationHelper from '../../utils/validationHelper';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { ogConfigFields } from '../../utils/fields/ogConfigFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

type OgConfigFormValues = {
  [key: string]: any;
};

const OgConfigTemplate: React.FC = () => {
  const methods = useForm<OgConfigFormValues>({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, setError, clearErrors, setValue, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore((state: any) => state.fetchSettings);
  const settings = useSettingsStore((state: any) => state.settings);
  const loading = useSettingsStore((state: any) => state.loading);
  const updateSettings = useSettingsStore((state: any) => state.updateSettings);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.og) {
      reset(settings.og);
    }
  }, [settings, reset]);

  // Validation logic for a single field
  const validateField = (field: any, value: any) => {
    let error = null;
    if (field.required) {
      if (field.type === 'file') {
        if (value === '__invalid_file_type__') {
          return { field: field.name, message: `${field.label} must be of type: ${field.accept}` };
        }
        if (settings?.og && settings.og[field.name]) {
          if (!value) return null;
        }
        error = ValidationHelper.isRequired(value, field.name);
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
    if (!error && field.type === 'email') {
      error = ValidationHelper.isValidEmail(value, field.name);
    }
    if (!error && Array.isArray(field.options)) {
      const allowedValues = field.options.map((opt: any) => opt.value);
      error = ValidationHelper.isValidEnum(value, field.name, allowedValues);
    }
    return error;
  };

  // Handle field change and validate
  const handleFieldChange = (field: any, value: any) => {
    setValue(field.name, value, { shouldValidate: true });
    // Special handling for file type error
    if (field.type === 'file' && value === '__invalid_file_type__') {
      setError(field.name, { type: 'manual', message: `${field.label} must be of type: ${field.accept}` });
      return;
    }
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
    const validationErrors = ogConfigFields.map(field => {
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
      // Check if there are any file uploads
      const hasFileUploads = ogConfigFields.some(field => 
        field.type === 'file' && formData[field.name] instanceof File
      );

      if (hasFileUploads) {
        // Create FormData for file uploads
        const formDataObj = new FormData();
        
        // Add managementName for file upload destination
        formDataObj.append('managementName', 'settings');
        
        ogConfigFields.forEach(field => {
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
        
        // Append the og data as a JSON string for the backend to parse
        formDataObj.append('og', JSON.stringify(formData));
        
        await updateSettings(formDataObj);
      } else {
        // Regular JSON update if no files
        await updateSettings({ og: formData });
      }
      
      toast.success('OG configuration updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="OG Configuration"
      />      
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={ogConfigFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="og-config-form"
          existingFiles={{
            ogImage: settings?.og?.ogImage ?? '',
          }}
          onFieldChange={Object.fromEntries(
            ogConfigFields.map(field => [
              field.name,
              (e: { target: { value: any } }) => handleFieldChange(field, e.target.value)
            ])
          )}
        />
      </FormProvider>
    </div>
  );
};

export default OgConfigTemplate;