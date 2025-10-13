import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/AuthStore';
import ValidationHelper from '../../utils/validationHelper';
import AuthFormContainer from '../../molecules/AuthFormContainer/AuthFormContainer';
import ManagementForm from '../../organisms/ManagementForm';
import type { FieldConfig } from '../../types/common';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Field configuration
const resetPasswordFields: FieldConfig[] = [
  {
    name: 'password',
    label: 'New Password',
    type: 'password',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Enter new password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Confirm new password',
  },
];

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuthStore();


  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, setError, clearErrors, watch, formState: { isSubmitting } } = methods;

  // Watch password for real-time validation feedback
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const handleFieldChange = (fieldName: keyof ResetPasswordFormData, minLength?: number) => (e: { target: { value: any } }) => {
    const rawValue = e.target.value;
    const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    
    const validations = [] as any[];
    
    // Required validation first
    const requiredError = ValidationHelper.isRequired(valueForValidation, fieldName === 'confirmPassword' ? 'Confirm Password' : 'Password');
    if (requiredError) {
      setError(fieldName, {
        type: 'manual',
        message: requiredError.message,
      });
      methods.setValue(fieldName, rawValue, { shouldValidate: false });
      return;
    }
    
    // Only check other validations if value exists
    if (valueForValidation) {
      if (fieldName === 'password') {
        validations.push(ValidationHelper.isValidPassword(valueForValidation, 'Password'));
      }
      
      if (fieldName === 'confirmPassword') {
        const currentPassword = methods.getValues('password');
        if (currentPassword) {
          validations.push(ValidationHelper.passwordMatch(currentPassword.trim(), valueForValidation));
        }
      }
    }

    const errorsArr = ValidationHelper.validate(validations);
    
    if (errorsArr.length > 0) {
      setError(fieldName, {
        type: 'manual',
        message: errorsArr[0].message,
      });
    } else {
      clearErrors(fieldName);
    }
    
    methods.setValue(fieldName, rawValue, { shouldValidate: false });
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid reset token. Please request a new password reset link.');
      return;
    }

    clearErrors();

    // Normalize values (trim strings)
    const d = {
      password: data.password.trim(),
      confirmPassword: data.confirmPassword.trim(),
    };

    // First validate all form fields with precedence: required > other rules
    const validations: any[] = [];
    validations.push(ValidationHelper.isRequired(d.password, 'Password'));
    if (d.password) validations.push(ValidationHelper.isValidPassword(d.password, 'Password'));
    
    validations.push(ValidationHelper.isRequired(d.confirmPassword, 'Confirm Password'));
    if (d.confirmPassword && d.password) {
      validations.push(ValidationHelper.passwordMatch(d.password, d.confirmPassword));
    }

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      // Only set the first error per field so required errors are not overridden
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const key = err.field.toLowerCase();
        const fieldName = key.includes('confirm') ? 'confirmPassword' : (key as keyof ResetPasswordFormData);
        if (seen.has(key)) continue;
        seen.add(key);
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
      }
      toast.error('Please fix all validation errors');
      return;
    }

    try {
      await resetPassword(token, d.password);
      // Success toast and redirect handled in AuthStore
    } catch (error: any) {
      // Error toast is already shown by the AuthStore
      console.error('Reset password error:', error?.message);
    }
  };

  // Ensure centralized submit validation runs even when form is invalid
  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return null;
    
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordStrength = getPasswordStrength();

  const formContent = (
    <FormProvider {...methods}>
      <ManagementForm
        label="Reset Password"
        fields={resetPasswordFields}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        isAuth={true}
        onFieldChange={{
          password: handleFieldChange('password'),
          confirmPassword: handleFieldChange('confirmPassword'),
        }}
        extraProps={{

        }}
      />
      
      {/* Password Strength Indicator */}
      {password && (
        <div className="mt-3 mb-4 p-3 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg">
          <p className="text-xs text-[var(--light-grey-color)] mb-2 font-semibold">
            Password Requirements:
          </p>
          <ul className="space-y-1 text-xs">
            <li className={`flex items-center gap-2 ${passwordStrength?.hasMinLength ? 'text-green-500' : 'text-[var(--light-grey-color)]'}`}>
              <span>{passwordStrength?.hasMinLength ? '✓' : '○'}</span>
              At least 8 characters
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength?.hasUpperCase ? 'text-green-500' : 'text-[var(--light-grey-color)]'}`}>
              <span>{passwordStrength?.hasUpperCase ? '✓' : '○'}</span>
              One uppercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength?.hasLowerCase ? 'text-green-500' : 'text-[var(--light-grey-color)]'}`}>
              <span>{passwordStrength?.hasLowerCase ? '✓' : '○'}</span>
              One lowercase letter
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength?.hasNumber ? 'text-green-500' : 'text-[var(--light-grey-color)]'}`}>
              <span>{passwordStrength?.hasNumber ? '✓' : '○'}</span>
              One number
            </li>
            <li className={`flex items-center gap-2 ${passwordStrength?.hasSpecialChar ? 'text-green-500' : 'text-[var(--light-grey-color)]'}`}>
              <span>{passwordStrength?.hasSpecialChar ? '✓' : '○'}</span>
              One special character (@$!%*?&)
            </li>
          </ul>
          {passwordStrength?.isValid && (
            <p className="mt-2 text-xs text-green-500 font-semibold">
              ✓ Password meets all requirements
            </p>
          )}
        </div>
      )}

      <div className="text-center mt-4">
        <Link
          to="/login"
          className="text-[var(--light-grey-color)] hover:text-[var(--white-color)] text-sm underline transition-all duration-300"
        >
          Back to Login
        </Link>
      </div>
    </FormProvider>
  );

  const resetPasswordCarouselData = [
    {
      title: 'Create New Password',
      desc: 'Please enter your new password. Make sure it\'s secure and you\'ll remember it.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
    {
      title: 'Secure Your Account',
      desc: 'Use a strong password with a mix of letters, numbers, and special characters.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
    {
      title: 'Almost Done',
      desc: 'After resetting, you\'ll be able to log in with your new password.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
  ];

  return (
    <AuthFormContainer
      carouselData={resetPasswordCarouselData}
      carouselTitle="Create New Password"
      carouselDescription="Please enter your new password. Make sure it's secure and you'll remember it."
      pageTitle="Reset Password"
      pageSubtitle="Enter your new password below"
      formContent={formContent}
    />
  );
};

export default ResetPassword;