import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/AuthStore';
import ValidationHelper from '../../utils/validationHelper';
import AuthFormContainer from '../../molecules/AuthFormContainer/AuthFormContainer';
import ManagementForm from '../../organisms/ManagementForm';
import type { FieldConfig } from '../../types/common';

interface ForgotPasswordFormData {
  email: string;
}

// Field configuration
const forgotPasswordFields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Enter your email address',
  },
];

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuthStore();

  const methods = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, setError, clearErrors, formState: { isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof ForgotPasswordFormData) => (e: { target: { value: any } }) => {
    const rawValue = e.target.value;
    const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    
    const validations = [] as any[];
    
    // Required validation first
    const requiredError = ValidationHelper.isRequired(valueForValidation, 'Email');
    if (requiredError) {
      setError(fieldName, {
        type: 'manual',
        message: requiredError.message,
      });
      methods.setValue(fieldName, rawValue, { shouldValidate: false });
      return;
    }
    
    // Only check email format if value exists
    if (valueForValidation) {
      validations.push(ValidationHelper.isValidEmail(valueForValidation, 'Email'));
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearErrors();

    // Normalize values (trim strings)
    const d = {
      email: data.email.trim(),
    };

    // First validate all form fields with precedence: required > other rules
    const validations: any[] = [];
    validations.push(ValidationHelper.isRequired(d.email, 'Email'));
    if (d.email) validations.push(ValidationHelper.isValidEmail(d.email, 'Email'));

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      // Only set the first error per field so required errors are not overridden
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const key = err.field.toLowerCase();
        const fieldName = key as keyof ForgotPasswordFormData;
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
      const response = await forgotPassword(d.email) as { status: boolean; message: string; emailSent: boolean };
      // Check response status
      if (response.status === true) {
        if (!response.emailSent) {
          // Email not found case
          toast.error('This email address is not registered with us. Please check and try again.');
          return;
        }
        // Email sent successfully case
        toast.success(response.message || 'If an account exists with this email, you will receive password reset instructions.');
      }
    } catch (error: any) {
      // Error toast is already shown by the AuthStore
      console.error('Forgot password error:', error?.message);
      toast.error('Failed to process your request. Please try again later.');
    }
  };

  // Ensure centralized submit validation runs even when form is invalid
  const onInvalid = () => {
    const values = methods.getValues();
    return onSubmit(values);
  };

  const formContent = (
    <FormProvider {...methods}>
      <ManagementForm
        label="Send Reset Link"
        fields={forgotPasswordFields}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        isAuth={true}
        onFieldChange={{
          email: handleFieldChange('email'),
        }}
      />
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

  const forgotPasswordCarouselData = [
    {
      title: 'Reset Your Password',
      desc: 'Don\'t worry! It happens. Please enter the email address associated with your account.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
    {
      title: 'Quick Recovery',
      desc: 'We\'ll send you a secure link to reset your password instantly.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
    {
      title: 'Stay Protected',
      desc: 'Your account security is our top priority.',
      img: '/assets/image/common/form-carousel-card.jpg',
    },
  ];

  return (
    <AuthFormContainer
      carouselData={forgotPasswordCarouselData}
      carouselTitle="Reset Your Password"
      carouselDescription="Don't worry! It happens. Please enter the email address associated with your account."
      pageTitle="Forgot Password"
      pageSubtitle="Enter your email to receive reset instructions"
      formContent={formContent}
    />
  );
};

export default ForgotPassword;