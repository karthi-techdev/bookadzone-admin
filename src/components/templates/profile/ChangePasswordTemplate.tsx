import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useProfileStore } from '../../stores/ProfileStore';
import FormHeader from '../../molecules/FormHeader';
import ValidationHelper from '../../utils/validationHelper';
import { toast } from 'react-toastify';
import { changePasswordFields } from '../../utils/fields/profileFields';
import ManagementForm from '../../organisms/ManagementForm';
import 'react-toastify/dist/ReactToastify.css';

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}


const ChangePasswordTemplate: React.FC = () => {
  const changePassword = useProfileStore(state => state.changePassword);
  const methods = useForm<ChangePasswordFormData>({
    mode: 'onChange'
  });
  
  const { setError, clearErrors, setValue, getValues } = methods;



  // Create field handlers with simpler validation logic
  const fieldHandlers = React.useMemo(() => ({
    oldPassword: (e: { target: { value: string } }) => {
      const value = e.target.value;
      // Just set the value, validation will be handled by the form
      setValue('oldPassword', value, { shouldValidate: true });
    },
    newPassword: (e: { target: { value: string } }) => {
      const value = e.target.value;
      setValue('newPassword', value, { shouldValidate: true });
      
      // Only validate confirm password if it exists
      const confirmValue = getValues('confirmPassword');
      if (confirmValue) {
        methods.trigger('confirmPassword');
      }
    },
    confirmPassword: (e: { target: { value: string } }) => {
      const value = e.target.value;
      setValue('confirmPassword', value, { shouldValidate: true });
    }
  }), [setValue, getValues, methods]);

  // Setup form validation rules
  React.useEffect(() => {
    methods.register('oldPassword', {
      required: 'Current Password is required',
      validate: (value) => {
        const requiredError = ValidationHelper.isRequired(value, 'Current Password');
        return requiredError ? requiredError.message : true;
      }
    });

    methods.register('newPassword', {
      required: 'New Password is required',
      validate: (value) => {
        const requiredError = ValidationHelper.isRequired(value, 'New Password');
        if (requiredError) return requiredError.message;
        
        const passwordError = ValidationHelper.isValidPassword(value, 'New Password');
        return passwordError ? passwordError.message : true;
      }
    });

    methods.register('confirmPassword', {
      required: 'Confirm Password is required',
      validate: (value) => {
        const newPassword = getValues('newPassword');
        if (value !== newPassword) {
          return 'Passwords do not match';
        }
        return true;
      }
    });
  }, [methods, getValues]);


  
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      clearErrors();

      if (!data) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Get and validate values
      const oldPassword = data.oldPassword || '';
      const newPassword = data.newPassword || '';
      const confirmPassword = data.confirmPassword || '';

      // Check for empty fields first
      if (!oldPassword || !newPassword || !confirmPassword) {
        if (!oldPassword) setError('oldPassword', { type: 'required', message: 'Current Password is required' });
        if (!newPassword) setError('newPassword', { type: 'required', message: 'New Password is required' });
        if (!confirmPassword) setError('confirmPassword', { type: 'required', message: 'Confirm Password is required' });
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate password strength
      const passwordValidation = ValidationHelper.isValidPassword(newPassword.trim(), 'New Password');
      if (passwordValidation) {
        setError('newPassword', { type: 'validate', message: passwordValidation.message });
        toast.error('Please fix password validation errors');
        return;
      }

      // Validate password match
      if (newPassword.trim() !== confirmPassword.trim()) {
        setError('confirmPassword', {
          type: 'validate',
          message: 'Passwords do not match'
        });
        toast.error('Passwords do not match');
        return;
      }

      // Attempt to change password
      await changePassword({
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim()
      });

      toast.success('Password changed successfully');
      methods.reset();
    } catch (error) {
      // Error is handled in the provider
      console.error('Password change error:', error);
    }
  };



  return (
    <div className="p-6">
      <FormHeader managementName="Change Password" />
      <FormProvider {...methods}>
        <ManagementForm 
          fields={changePasswordFields}
          label="Change Password"
          onSubmit={methods.handleSubmit(onSubmit)}
          isSubmitting={methods.formState.isSubmitting}
          onFieldChange={fieldHandlers}
          extraProps={{

          }}
        />
      </FormProvider>
    </div>
  );
};

export default ChangePasswordTemplate;