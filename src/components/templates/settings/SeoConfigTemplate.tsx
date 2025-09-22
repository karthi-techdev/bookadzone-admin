import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { seoConfigFields } from '../../utils/fields/seoConfigFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

const SeoConfigTemplate: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
  const { handleSubmit, reset, clearErrors, formState: { isSubmitting } } = methods;

  const fetchSettings = useSettingsStore(state => state.fetchSettings);
  const settings = useSettingsStore(state => state.settings);
  const loading = useSettingsStore(state => state.loading);
  const error = useSettingsStore(state => state.error);
  const updateSettings = useSettingsStore(state => state.updateSettings);

  React.useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  React.useEffect(() => {
    if (settings?.seo) {
      reset(settings.seo);
    }
  }, [settings, reset]);

  const onSubmit = async (formData: any) => {
    clearErrors();
    try {
      await updateSettings({ seo: formData });
      toast.success('SEO configuration updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Seo Configuration"
      />      
      <ToastContainer position="top-right" autoClose={3000} />
      <FormProvider {...methods}>
        <ManagementForm
          label="Update"
          fields={seoConfigFields}
          isSubmitting={isSubmitting || loading}
          onSubmit={handleSubmit(onSubmit)}
          data-testid="seo-config-form"
        />
      </FormProvider>
    </div>
  );
};

export default SeoConfigTemplate;
