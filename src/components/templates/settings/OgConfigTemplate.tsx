import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { ogConfigFields } from '../../utils/fields/ogConfigFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

const OgConfigTemplate: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, clearErrors, formState: { isSubmitting } } = methods;

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

  const onSubmit = async (formData: any) => {
    clearErrors();
    try {
      await updateSettings({ og: formData });
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
        />
      </FormProvider>
    </div>
  );
};

export default OgConfigTemplate;
