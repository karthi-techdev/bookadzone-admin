
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuthStore } from '../../stores/AuthStore';
import { useProfileStore } from '../../stores/ProfileStore';
import FormHeader from '../../molecules/FormHeader';
import { toast } from 'react-toastify';
import { profileUpdateFields } from '../../utils/fields/profileFields';
import ManagementForm from '../../organisms/ManagementForm';
import 'react-toastify/dist/ReactToastify.css';

type ProfileFormData = {
  email: string;
  name: string;
};

const ProfileUpdateTemplate: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const updateProfile = useProfileStore(state => state.updateProfile);
  const methods = useForm<ProfileFormData>({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || ''
    }
  });

  const { setError, clearErrors, setValue } = methods;

  // Handle field change and validate
  const validateFieldValue = (fieldName: string, value: string) => {
    let error = null;
    switch(fieldName) {
      case 'email':
        if (!value) error = { message: 'Email is required' };
        else if (!value.includes('@') || !value.includes('.')) error = { message: 'Invalid email format' };
        break;
      case 'name':
        if (!value) error = { message: 'Name is required' };
        else if (value.length < 2) error = { message: 'Name must be at least 2 characters long' };
        else if (value.length > 50) error = { message: 'Name cannot be longer than 50 characters' };
        break;
    }
    return error;
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      clearErrors();

      // Normalize values
      const d = {
        email: data.email.trim(),
        name: data.name.trim()
      };

      // Validate all fields before submission
      const errors = {
        email: validateFieldValue('email', d.email),
        name: validateFieldValue('name', d.name)
      };

      const hasErrors = Object.values(errors).some(error => error !== null);
      
      if (hasErrors) {
        Object.entries(errors).forEach(([field, error]) => {
          if (error) {
            setError(field as keyof ProfileFormData, {
              type: 'manual',
              message: error.message
            });
          }
        });
        toast.error('Please fix all validation errors');
        return;
      }

      await updateProfile(d);
    } catch (error) {
      // Error is handled in the provider
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="p-6">
      <FormHeader managementName="Profile Settings" />
      <FormProvider {...methods}>
        <ManagementForm 
          fields={profileUpdateFields}
          label="Update Profile"
          onSubmit={methods.handleSubmit(onSubmit)}
          isSubmitting={methods.formState.isSubmitting}
          onFieldChange={{
            email: (e: any) => {
              const value = e.target.value;
              setValue('email', value, { shouldValidate: true });
              const error = validateFieldValue('email', value);
              if (error) {
                setError('email', error);
              } else {
                clearErrors('email');
              }
            },
            name: (e: any) => {
              const value = e.target.value;
              setValue('name', value, { shouldValidate: true });
              const error = validateFieldValue('name', value);
              if (error) {
                setError('name', error);
              } else {
                clearErrors('name');
              }
            }
          }}
        />
      </FormProvider>
    </div>
  );
};

export default ProfileUpdateTemplate;