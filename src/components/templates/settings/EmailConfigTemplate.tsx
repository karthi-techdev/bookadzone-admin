import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { emailConfigFields } from '../../utils/fields/emailConfigFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

const EmailConfigTemplate: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, clearErrors, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore((state: any) => state.fetchSettings);
  const settings = useSettingsStore((state: any) => state.settings);
  const loading = useSettingsStore((state: any) => state.loading);
  const updateSettings = useSettingsStore((state: any) => state.updateSettings);

  // Password visibility toggle for smtpPassword
  const [showSmtpPassword, setShowSmtpPassword] = React.useState(false);
  const toggleSmtpPassword = () => setShowSmtpPassword((prev) => !prev);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.email) {
      reset(settings.email);
    }
  }, [settings, reset]);

  const onSubmit = async (formData: any) => {
    clearErrors();
    try {
      await updateSettings({ email: formData });
      toast.success('Email configuration updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Email Configuration"
      />
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={emailConfigFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="email-config-form"
          extraProps={{
            togglePassword: toggleSmtpPassword,
            showPassword: showSmtpPassword,
          }}
        />
      </FormProvider>
    </div>
  );
};

export default EmailConfigTemplate;
