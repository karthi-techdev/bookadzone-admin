import React from 'react';
import ValidationHelper from '../../utils/validationHelper';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { contactInfoFields } from '../../utils/fields/contactInfoFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

type ContactInfoFormValues = {
  [key: string]: any;
};

const ContactInfoTemplate: React.FC = () => {
  const methods = useForm<ContactInfoFormValues>({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, setError, clearErrors, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore((state: any) => state.fetchSettings);
  const settings = useSettingsStore((state: any) => state.settings);
  const loading = useSettingsStore((state: any) => state.loading);
  const updateSettings = useSettingsStore((state: any) => state.updateSettings);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.contact) {
      reset(settings.contact);
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
        if (settings?.contact && settings.contact[field.name]) {
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
    const validationErrors = contactInfoFields.map(field => {
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
      await updateSettings({ contact: formData });
      toast.success('Contact info updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Contact Info"
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={contactInfoFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="contact-info-form"
          onFieldChange={Object.fromEntries(
            contactInfoFields.map(field => [
              field.name,
              (e: { target: { value: any } }) => handleFieldChange(field, e.target.value)
            ])
          )}
        />
      </FormProvider>
    </div>
  );
};

export default ContactInfoTemplate;
