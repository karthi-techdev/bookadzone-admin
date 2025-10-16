import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../stores/AuthStore';
import ManagementForm from '../../organisms/ManagementForm';
import { loginFields } from '../../utils/fields/loginFields';
import ValidationHelper from '../../utils/validationHelper';
import AuthFormContainer from '../../molecules/AuthFormContainer/AuthFormContainer';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useAuthStore();


  const methods = useForm<LoginFormData>({
    defaultValues: {
      username: 'admin@gmail.com',
      password: 'admin@123',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    // Only redirect to dashboard if user is logged in and not trying to access auth-related pages
    if (user && token && !location.pathname.match(/\/(login|forgot-password|reset-password)/i)) {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate, location.pathname]);

  const { handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const handleFieldChange = (fieldName: keyof LoginFormData, minLength?: number) => (e: { target: { value: any } }) => {
    const rawValue = e.target.value;
    const valueForValidation = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    
    const validations = [] as any[];
    
    // Required validation first
    if (fieldName === 'username') {
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
    }
    
    if (fieldName === 'password') {
      const requiredError = ValidationHelper.isRequired(valueForValidation, 'Password');
      if (requiredError) {
        setError(fieldName, {
          type: 'manual',
          message: requiredError.message,
        });
        methods.setValue(fieldName, rawValue, { shouldValidate: false });
        return;
      }
      
      // Only check minLength if value exists
      if (valueForValidation && minLength) {
        validations.push(ValidationHelper.minLength(valueForValidation, 'Password', minLength));
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

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();

    // Normalize values (trim strings)
    const d = {
      username: data.username.trim(),
      password: data.password.trim(),
    };

    // First validate all form fields with precedence: required > other rules
    const validations: any[] = [];
    validations.push(ValidationHelper.isRequired(d.username, 'Email'));
    if (d.username) validations.push(ValidationHelper.isValidEmail(d.username, 'Email'));
    
    validations.push(ValidationHelper.isRequired(d.password, 'Password'));
    if (d.password) validations.push(ValidationHelper.minLength(d.password, 'Password', 4));

    const validationErrors = ValidationHelper.validate(validations);

    if (validationErrors.length > 0) {
      // Only set the first error per field so required errors are not overridden
      const seen = new Set<string>();
      for (const err of validationErrors) {
        const key = err.field.toLowerCase();
        const fieldName = key === 'email' ? 'username' : (key as keyof LoginFormData);
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
      await login({ email: d.username, password: d.password });
      navigate('/', { replace: true });
    } catch (error: any) {
      // Error toast is already shown by the AuthStore
      console.error('Login error:', error?.message);
      
      // Handle rate limiting (429) - don't set field errors, just show toast
      if (error?.message?.toLowerCase().includes('too many')) {
        // Toast already shown in AuthStore, no need to set field errors
        return;
      }
      
      // Set field-level errors for specific validation errors
      if (error?.message?.toLowerCase().includes('email') || 
          error?.message?.toLowerCase().includes('not found') ||
          error?.message?.toLowerCase().includes('does not exist')) {
        setError('username', {
          type: 'manual',
          message: error.message,
        });
      } else if (error?.message?.toLowerCase().includes('password') ||
                 error?.message?.toLowerCase().includes('incorrect') ||
                 error?.message?.toLowerCase().includes('invalid')) {
        setError('password', {
          type: 'manual',
          message: error.message,
        });
      }
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
        label="Login"
        fields={loginFields}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        isAuth={true}
        onFieldChange={{
          username: handleFieldChange('username'),
          password: handleFieldChange('password', 4),
        }}
        extraProps={{}}
      />
       <div className="mt-2 forgot-link w-full relative bottom-[90px] flex justify-end mb-4">
              <Link to="/forgot-password" className="text-xs text-[10px] text-[var(--light-grey-color)] hover:text-[var(--white-color)] underline transition-all duration-300 ease-in-out">Forgot Password?</Link>
            </div>
            <div className="login-with relative bottom-[15px] relative w-full flex justify-center items-center my-4">
              <div className="login-beforeline bg-[#ffffff9e] h-[1px] w-[70px] mr-[8px]"></div>
              <span className="text-xs text-[10px] text-[var(--light-grey-color)]">Or Login With </span>
              <div className="login-afterline bg-[#ffffff9e] h-[1px] w-[70px] ml-[8px]"></div>
            </div>
            <div className="login-methods flex justify-center items-center gap-4 w-full">
              <Link to="/login/google" className="px-5 py-2 rounded-md bg-[var(--white-color)] font-medium text-sm cursor-pointer flex items-center gap-2 font-semibold shadow hover:bg-gray-100 transition"> <FcGoogle className="text-xl"/> Google</Link>
              <Link to="/login/facebook" className="px-5 py-2 rounded-md bg-[#ffffff] text-[var(--#000000)] font-medium text-sm cursor-pointer flex items-center gap-2 font-semibold shadow hover:bg-[#145db2] transition"><FaApple className="text-xl" /> Apple</Link>
            </div>
            <div className="already-have-account mt-3 text-center w-full">
              <span className="text-xs text-[10px] text-[var(--light-grey-color)]">Don't have an account? <Link to="/register" className="text-[var(--puprle-color)] font-medium underline">Signup</Link></span>
            </div>
    </FormProvider>
  );

  return (
    <AuthFormContainer
      carouselData={carouselData}
      carouselTitle="Map Your Reach. Maximize Your Impact."
      carouselDescription="Quickly explore and book hoardings directly from the interactive map."
      pageTitle="Welcome back!"
      pageSubtitle="Please enter your details"
      formContent={formContent}
    />
  );
};

export default Login;

// Carousel data
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