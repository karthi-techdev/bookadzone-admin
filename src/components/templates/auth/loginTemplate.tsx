import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { FaSquareFacebook } from 'react-icons/fa6';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuthStore } from '../../stores/AuthStore';
import ValidationHelper from '../../utils/validationHelper';
import 'swiper/css';
import 'swiper/css/pagination';

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

  const { handleSubmit, setError, clearErrors, formState: { errors, isSubmitting } } = methods;

  const onSubmit = async (data: LoginFormData) => {
    // Clear all previous errors before re-validating
    clearErrors();

    // Validate using ValidationHelper
    const validationErrors = ValidationHelper.validate([
      ValidationHelper.isRequired(data.username, 'Email'),
      ValidationHelper.isValidEmail(data.username, 'Email'),
      ValidationHelper.isRequired(data.password, 'Password'),
      // Relaxed password validation to match original min 4 chars
      ValidationHelper.minLength(data.password, 'Password', 4),
    ]);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => {
        setError(err.field.toLowerCase() as keyof LoginFormData, {
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
      const message =
        error?.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <section className='login-page flex h-[100dvh] flex flex-col justify-center items-center px-55'>
      <div className="login-box bg-[var(--light-dark-color)] p-7 grid grid-cols-2 gap-4 rounded-[20px] border-[1px] border-[var(--light-blur-grey-color)]">
        <div className="carousel-part pr-2">
          <div className="carousel bg-[var(--puprle-color)] rounded-[20px] py-3">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              grabCursor={true}
              pagination={{ clickable: true }}
              className="mySwiper"
            >
              {[1, 2, 3].map((_, idx) => (
                <SwiperSlide key={idx}>
                  <div className="cards px-7 py-6">
                    <div className="contents">
                      <h3 className='font-bold text-[1.55rem] text-[var(--white-color)] mb-2'>Map Your Reach. Maximize Your Impact.</h3>
                      <p className='font-medium text-[.70rem] text-[var(--white-color)] mb-5'>Quickly explore and book hoardings directly from the interactive map.</p>
                    </div>
                    <div className="card-image rounded-[20px] overflow-hidden h-[250px] flex justify-center flex-col">
                      <img src="/assets/image/common/form-carousel-card.jpg" alt="" className='object-cover' />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="form-part pl-2 flex flex-col items-center justify-between w-full">
          <div className="header-content flex flex-col justify-center items-center mt-8">
            <img src="/assets/image/logo/bookadzone-logo.png" alt="bookadzone-logo" className='w-[150px] mb-2' />
          </div>
          <FormProvider {...methods}>
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
          </FormProvider>
        </div>
      </div>
    </section>
  );
};

export default Login;