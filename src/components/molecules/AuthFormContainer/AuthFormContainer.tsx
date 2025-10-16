import React, { type ReactNode } from 'react';
import { useSettings } from '../../providers/SettingsProvider';

interface CarouselItem {
  title: string;
  desc: string;
  img: string;
}

interface AuthFormContainerProps {
  carouselData: CarouselItem[];
  carouselTitle: string;
  carouselDescription: string;
  pageTitle: string;
  pageSubtitle: string;
  formContent: ReactNode;
}

const AuthFormContainer: React.FC<AuthFormContainerProps> = ({
  carouselData,
  carouselTitle,
  carouselDescription,
  pageTitle,
  pageSubtitle,
  formContent
}) => {
  const { settings, fileUrl } = useSettings();
  const logo = settings?.general?.siteLogo ? `${fileUrl}${settings.general.siteLogo}` : '/assets/image/logo/bookadzone-logo.png';

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [slideDirection, setSlideDirection] = React.useState<'left' | 'right'>('right');
  const [isSliding, setIsSliding] = React.useState(false);
  const slideDuration = 500;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection('right');
      setIsSliding(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselData.length);
        setIsSliding(false);
      }, slideDuration);
    }, 3500);
    return () => clearInterval(timer);
  }, [carouselData.length]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setSlideDirection(index > currentIndex ? 'right' : 'left');
    setIsSliding(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsSliding(false);
    }, slideDuration);
  };

  const currentSlide = carouselData[currentIndex];

  return (
    <section className="login-page min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-2 md:px-0">
      <div className="login-box bg-[var(--light-dark-color)] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[20px] border border-[var(--light-blur-grey-color)] shadow-lg shadow-[var(--puprle-color)]/20 w-full max-w-5xl">
        {/* Left Side - Carousel */}
        <div className="carousel-part md:pr-2 flex items-center justify-center">
          <div className="carousel bg-[var(--puprle-color)] rounded-[20px] py-3 w-full h-full flex items-center relative overflow-hidden">
            <div 
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ${
                isSliding 
                  ? slideDirection === 'right' 
                    ? '-translate-x-full' 
                    : 'translate-x-full' 
                  : 'translate-x-0'
              }`}
            >
              <div className="cards px-4 md:px-7 py-6 flex flex-col h-full justify-between w-full">
                <div className="contents">
                  <h3 className="font-bold text-2xl md:text-3xl text-[var(--white-color)] mb-2 leading-tight">{carouselTitle}</h3>
                  <p className="font-medium text-sm md:text-base text-[var(--white-color)] mb-5">{carouselDescription}</p>
                </div>
                <div className="card-image rounded-xl overflow-hidden h-[180px] md:h-[250px] flex justify-center items-center bg-white/10">
                  <img src={currentSlide.img} alt={currentSlide.title} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-2 gap-2 absolute left-0 right-0 bottom-4 z-30">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-part md:pl-2 flex flex-col items-center justify-center w-full">
          <div className="header-content flex flex-col justify-center items-center mt-4 md:mt-8 mb-6">
            <img src={logo} alt={settings?.general?.siteName || 'logo'} className="w-[120px] md:w-[150px] mb-4" />
            <h2 className="text-2xl font-bold text-[var(--white-color)] mb-2">{pageTitle}</h2>
            <p className="text-[var(--light-grey-color)] text-sm text-center">{pageSubtitle}</p>
          </div>
          {formContent}
        </div>
      </div>
    </section>
  );
};

export default AuthFormContainer;