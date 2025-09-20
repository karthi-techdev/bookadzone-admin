import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
// Swiper removed. Using custom carousel below.
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook } from 'react-icons/fa6';
<<<<<<< HEAD
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../stores/AuthStore';
=======
import ManagementForm from '../../organisms/ManagementForm';
import { loginFields } from '../../utils/fields/loginFields';
import { useAuthStore } from '../../stores/authStore';
>>>>>>> 6ed33a0643ad56507648321eacc5386b2902367e
import ValidationHelper from '../../utils/validationHelper';
// Swiper CSS imports removed.

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, token } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const methods = useForm<LoginFormData>({
    defaultValues: {
      username: 'admin@gmail.com',
      password: 'admin@123',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (user && token && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate, location.pathname]);

  const { handleSubmit, setError, clearErrors, trigger, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (data: LoginFormData) => {
    clearErrors();
    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(data.username, 'Email'),
      ValidationHelper.isValidEmail(data.username, 'Email'),
      ValidationHelper.isRequired(data.password, 'Password'),
      ValidationHelper.minLength(data.password, 'Password', 4),
    ]);

    if (validationErrors.length > 0) {
      console.log('Validation errors:', validationErrors);
      validationErrors.forEach((err) => {
        // Map ValidationHelper field names to form field names
        let fieldName: keyof LoginFormData = 'username';
        if (err.field.toLowerCase() === 'password') fieldName = 'password';
        // For email, use 'username' field
        console.log('Setting error for field:', fieldName, 'with message:', err.message);
        setError(fieldName, {
          type: 'manual',
          message: err.message,
        });
        toast.error(err.message);
      });
      return;
    }

    try {
      await login({ email: data.username, password: data.password });
      toast.success('Login successful!');
      navigate('/', { replace: true });
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <section className="login-page min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-2 md:px-0">
      <div className="login-box bg-[var(--light-dark-color)] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[20px] border border-[var(--light-blur-grey-color)] shadow-lg shadow-[var(--puprle-color)]/20 w-full max-w-5xl">
        {/* Carousel Section (Custom) */}
        <div className="carousel-part md:pr-2 flex items-center justify-center">
          <CustomCarousel />
        </div>
        {/* Form Section */}
        <div className="form-part md:pl-2 flex flex-col items-center justify-center w-full">
          <div className="header-content flex flex-col justify-center items-center mt-4 md:mt-8 mb-2">
            <img src="/assets/image/logo/bookadzone-logo.png" alt="bookadzone-logo" className="w-[120px] md:w-[150px] mb-2" />
          </div>
          <FormProvider {...methods}>
<<<<<<< HEAD
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>
              <div className="input-group bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] mb-4 w-[90%]">
                <input
                  {...methods.register('username', {
                    onChange: () => methods.clearErrors('username'),
                  })}
                  type="email"
                  className='outline-none w-full p-3 text-[.75rem] text-[var(--white-color)] placeholder:text-[var(--light-grey-color)]'
                  placeholder='Enter Your Email'
                />
                {errors.username && (
                  <span className="text-xs text-red-500 mt-1">{errors.username.message}</span>
                )}
              </div>
              <div className="input-group bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] mb-4 w-[90%] relative">
                <input
                  {...methods.register('password', {
                    onChange: () => methods.clearErrors('password'),
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className='outline-none w-full p-3 text-[.75rem] text-[var(--white-color)] placeholder:text-[var(--light-grey-color)] pr-10'
                  placeholder='Enter Your Password'
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[1rem] text-[var(--light-grey-color)] hover:text-[var(--white-color)] focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && (
                  <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>
                )}
              </div>
              <div className="forgot-link w-[90%] flex justify-end mb-4">
                <Link to="/forgot-password" className='text-[.50rem] text-[var(--light-grey-color)] hover:text-[var(--white-color)] underline transition-all duration-300 ease-in ease-out'>Forgot Password?</Link>
              </div>
              <div className="button-group w-[90%]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='p-3 bg-[var(--puprle-color)] text-[var(--white-color)] font-medium text-[.75rem] cursor-pointer rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] w-full disabled:opacity-50'
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </div>
              <div className="login-with relative w-[50%] flex justify-center items-center my-4">
                <span className='text-[.50rem] text-[var(--light-grey-color)]'>Or Login With</span>
              </div>
              <div className="login-methods flex justify-center items-center gap-4">
                <Link to="/login/google" className='px-5 py-2 rounded-[5px] bg-[var(--white-color)] font-medium text-[.65rem] cursor-pointer flex items-center gap-2 font-semibold'> <FcGoogle className='text-[1.2rem]' /> Google</Link>
                <Link to="/login/facebook" className='px-5 py-2 rounded-[5px] bg-[#1877F2] text-[var(--white-color)] font-medium text-[.65rem] cursor-pointer flex items-center gap-2 font-semibold'><FaSquareFacebook className='text-[1.2rem]' /> Facebook</Link>
              </div>
              <div className="already-have-account mt-3">
                <span className='text-[.50rem] text-[var(--light-grey-color)]'>Don't have an account? <Link to="/register" className='text-[var(--puprle-color)] font-medium underline'>Register Now</Link></span>
              </div>
            </form>
=======
            <ManagementForm
              label="Login"
              fields={loginFields.map(f => f.name === 'password' ? { ...f, type: showPassword ? 'text' : 'password' } : f)}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)}
              isAuth={true}
              onFieldChange={{
                username: (e) => {
                  const value = e.target.value;
                  methods.setValue('username', value, { shouldValidate: true, shouldDirty: true });
                  // Run validation for username/email
                  const emailErrors = ValidationHelper.validate([
                    ValidationHelper.isRequired(value, 'Email'),
                    ValidationHelper.isValidEmail(value, 'Email'),
                  ]);
                  if (emailErrors.length > 0) {
                    let fieldName: keyof LoginFormData = 'username';
                    setError(fieldName, {
                      type: 'manual',
                      message: emailErrors[0].message,
                    });
                  } else {
                    methods.clearErrors('username');
                  }
                },
                password: (e) => {
                  const value = e.target.value;
                  methods.setValue('password', value, { shouldValidate: true, shouldDirty: true });
                  // Run validation for password
                  const passwordErrors = ValidationHelper.validate([
                    ValidationHelper.isRequired(value, 'Password'),
                    ValidationHelper.minLength(value, 'Password', 4),
                  ]);
                  if (passwordErrors.length > 0) {
                    let fieldName: keyof LoginFormData = 'password';
                    setError(fieldName, {
                      type: 'manual',
                      message: passwordErrors[0].message,
                    });
                  } else {
                    methods.clearErrors('password');
                  }
                },
              }}
              extraProps={{ togglePassword: () => setShowPassword((prev) => !prev), showPassword }}
            />
            <div className="mt-2 forgot-link w-full flex justify-end mb-4">
              <Link to="/forgot-password" className="text-xs text-[var(--light-grey-color)] hover:text-[var(--white-color)] underline transition-all duration-300 ease-in-out">Forgot Password?</Link>
            </div>
            <div className="login-with relative w-full flex justify-center items-center my-4">
              <span className="text-xs text-[var(--light-grey-color)]">Or Login With</span>
            </div>
            <div className="login-methods flex justify-center items-center gap-4 w-full">
              <Link to="/login/google" className="px-5 py-2 rounded-md bg-[var(--white-color)] font-medium text-sm cursor-pointer flex items-center gap-2 font-semibold shadow hover:bg-gray-100 transition"> <FcGoogle className="text-xl"/> Google</Link>
              <Link to="/login/facebook" className="px-5 py-2 rounded-md bg-[#1877F2] text-[var(--white-color)] font-medium text-sm cursor-pointer flex items-center gap-2 font-semibold shadow hover:bg-[#145db2] transition"><FaSquareFacebook className="text-xl" /> Facebook</Link>
            </div>
            <div className="already-have-account mt-3 text-center w-full">
              <span className="text-xs text-[var(--light-grey-color)]">Don't have an account? <Link to="/register" className="text-[var(--puprle-color)] font-medium underline">Register Now</Link></span>
            </div>
>>>>>>> 6ed33a0643ad56507648321eacc5386b2902367e
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

export default Login;
// Simple custom carousel component (no external CSS or Swiper)
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
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<'left' | 'right'>('right');
  const [isSliding, setIsSliding] = React.useState(false);
  const slideDuration = 500;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDirection('right');
      setIsSliding(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % carouselData.length);
        setIsSliding(false);
      }, slideDuration);
    }, 3500);
    return () => clearInterval(timer);
  }, [index]);

  const handleDotClick = (i: number) => {
    if (i === index) return;
    setDirection(i > index ? 'right' : 'left');
    setIsSliding(true);
    setTimeout(() => {
      setIndex(i);
      setIsSliding(false);
    }, slideDuration);
  };

  const { title, desc, img } = carouselData[index];

  return (
    <div className="carousel bg-[var(--puprle-color)] rounded-[20px] py-3 w-full h-full flex items-center relative overflow-hidden">
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-500 ${isSliding ? (direction === 'right' ? '-translate-x-full' : 'translate-x-full') : 'translate-x-0'}`}
        style={{ zIndex: 10 }}
      >
        <div className="cards px-4 md:px-7 py-6 flex flex-col h-full justify-between w-full">
          <div className="contents">
            <h3 className="font-bold text-2xl md:text-3xl text-[var(--white-color)] mb-2 leading-tight">{title}</h3>
            <p className="font-medium text-sm md:text-base text-[var(--white-color)] mb-5">{desc}</p>
          </div>
          <div className="card-image rounded-xl overflow-hidden h-[180px] md:h-[250px] flex justify-center items-center bg-white/10">
            <img src={img} alt="" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-500 ${isSliding ? 'translate-x-0' : (direction === 'right' ? 'translate-x-full' : '-translate-x-full')}`}
        style={{ zIndex: 20 }}
      >
        <div className="cards px-4 md:px-7 py-6 flex flex-col h-full justify-between w-full">
          <div className="contents">
            <h3 className="font-bold text-2xl md:text-3xl text-[var(--white-color)] mb-2 leading-tight">{title}</h3>
            <p className="font-medium text-sm md:text-base text-[var(--white-color)] mb-5">{desc}</p>
          </div>
          <div className="card-image rounded-xl overflow-hidden h-[180px] md:h-[250px] flex justify-center items-center bg-white/10">
            <img src={img} alt="" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2 gap-2 absolute left-0 right-0 bottom-4 z-30">
        {carouselData.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}