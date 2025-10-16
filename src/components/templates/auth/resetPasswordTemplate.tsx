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
      confirmPassword: '',
    },
    mode: 'onChange',
  });

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
