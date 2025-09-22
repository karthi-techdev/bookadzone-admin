import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { useSettingsStore } from '../../stores/settingsStore';
import { generalSettingsFields } from '../../utils/fields/generalSettingsFields';
import FormHeader from '../../molecules/FormHeader';
import ManagementForm from '../../organisms/ManagementForm';

const GeneralSettingsTemplate: React.FC = () => {
  const methods = useForm({ defaultValues: {}, mode: 'onSubmit' });
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

  const onSubmit = async (formData: any) => {
    clearErrors();
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
        />
      </FormProvider>
    </div>
  );
};

export default GeneralSettingsTemplate;
