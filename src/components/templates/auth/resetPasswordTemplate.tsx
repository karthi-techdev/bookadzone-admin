<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/AuthStore';
import ManagementForm from '../../organisms/ManagementForm';
import ValidationHelper from '../../utils/validationHelper';
import type { InputType } from '../../types/common';

interface LloginFieldconfig {
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useAuthStore();
  const [showPassword] = useState(false);

  const methods = useForm<LloginFieldconfig>({
    defaultValues: {
      newPassword: '',
=======
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
>>>>>>> 6d68b3d53446aca9522715e11cc55b96757cc2cb
      confirmPassword: '',
    },
    mode: 'onChange',
  });

<<<<<<< HEAD
  useEffect(() => {
    if (user && token && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate, location.pathname]);

  const { handleSubmit, setError, clearErrors, formState: { isSubmitting }, watch } = methods;

  const onSubmit = async (data: LloginFieldconfig) => {
    clearErrors();

    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(data.newPassword, 'New Password'),
      ValidationHelper.minLength(data.newPassword, 'New Password', 4),
      ValidationHelper.isRequired(data.confirmPassword, 'Confirm Password'),
      ValidationHelper.minLength(data.confirmPassword, 'Confirm Password', 4),
    ]);

    if (data.newPassword !== data.confirmPassword) {
      validationErrors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        let fieldName: keyof LloginFieldconfig = 'newPassword';
        if (err.field.toLowerCase().includes('confirm')) fieldName = 'confirmPassword';
        setError(fieldName, { type: 'manual', message: err.message });
        toast.error(err.message);
      });
      return;
    }

    
  };
  const fields = [
    { name: 'newPassword', type: showPassword ? 'text' : 'password', placeholder: 'New Password', label: '' },
    { name: 'confirmPassword', type: showPassword ? 'text' : 'password', placeholder: 'Confirm Password', label: '' },
  ];
  

  return (
    <section className="login-page min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-2 md:px-0">
      <div className="login-box bg-[var(--light-dark-color)] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[20px] border border-[var(--light-blur-grey-color)] shadow-lg shadow-[var(--puprle-color)]/20 w-[860px] max-w-5xl">
        
        <div className="carousel-part md:pr-2 flex items-center justify-center">
          <CustomCarousel />
        </div>

        <div className="form-part md:pl-2 flex flex-col items-center justify-center w-[350px] ml-[35px] leading-[25px]">
          <div className="header-content leading-[35px] flex flex-col justify-center items-center mt-4 md:mt-8 mb-2">
            <img
              src="/assets/image/logo/bookadzone-logo.png"
              alt="bookadzone-logo"
              className="w-[120px] md:w-[150px] mb-2"
            />
            <h3 className="text-white mt-[7px] mb-[15px] text-[35px] font-semibold">
              Reset Password
            </h3>
          </div>

          <FormProvider {...methods}>
            <ManagementForm
              label="Confirm"
              fields={fields.map(f => f.name === 'password' ? { ...f, type: showPassword ? 'text' : 'password' } : f)}
              
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              isAuth={true}
            />
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

const carouselData = [
  {
    title: 'Map Your Reach. Maximize Your Impact.',
    desc: 'Quickly explore and book hoardings directly from the interactive map.',
    img: '/assets/image/common/form-carousel-card.jpg',
  },
  {
    title: 'Find the Best Locations',
    desc: 'Discover top advertising spots with ease and confidence.',
    img: '/assets/image/common/form-carousel-card.jpg',
  },
  {
    title: 'Book Instantly',
    desc: 'Secure your hoarding space in just a few clicks.',
    img: '/assets/image/common/form-carousel-card.jpg',
  },
];

function CustomCarousel() {
  const [index, setIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slideDuration = 500;

  useEffect(() => {
    const timer = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % carouselData.length);
        setIsSliding(false);
      }, slideDuration);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const { title, desc, img } = carouselData[index];

  return (
    <div className="relative bg-[#7f6aff] rounded-[30px] h-[470px] mt-[30px] flex flex-col justify-center items-center text-center p-6 w-full overflow-hidden">
      <div
        key={index}
        className={`w-full transition-all duration-700 ease-in-out transform ${isSliding ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
      >
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 leading-snug">
          {title}
        </h2>
        <p className="text-white text-sm mb-4">{desc}</p>
        <div className="rounded-[10px] overflow-hidden w-full max-w-sm mx-auto shadow-lg">
          <img
            src={img}
            alt="carousel"
            className="w-full h-[250px] object-cover"
          />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-5 absolute bottom-4">
        {carouselData.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-[3px] w-[40px] rounded-full transition-all duration-300 ${i === index ? 'bg-white' : 'bg-white/40'
              }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
=======
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
>>>>>>> 6d68b3d53446aca9522715e11cc55b96757cc2cb
