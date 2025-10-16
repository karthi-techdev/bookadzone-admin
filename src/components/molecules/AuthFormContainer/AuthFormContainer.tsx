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
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const slideDuration = 500;

  React.useEffect(() => {
    if (carouselData.length <= 1) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 3000);
    
    return () => clearInterval(timer);
  }, [carouselData.length, currentIndex]);

  const handleNext = () => {
    if (isTransitioning || carouselData.length <= 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
      setIsTransitioning(false);
    }, slideDuration);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex || isTransitioning || carouselData.length <= 1) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, slideDuration);
  };

  if (carouselData.length === 0) {
    return (
      <section className="login-page min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-2 md:px-0">
        <div className="login-box bg-[var(--light-dark-color)] p-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[20px] border border-[var(--light-blur-grey-color)] shadow-lg shadow-[var(--puprle-color)]/20 w-full max-w-5xl">
          <div className="form-part flex flex-col items-center justify-center w-full">
            <div className="header-content flex flex-col justify-center items-center mt-8 mb-2">
              <img src={logo} alt={settings?.general?.siteName || 'logo'} className="w-[150px] mb-2"/>
              <h2 className="welcome-back text-white text-[30px] font-sans font-bold">{pageTitle}</h2>
              <p className="welcome-back text-[10px] font-mono text-[#ffffff9e] font-bold">{pageSubtitle}</p>
            </div>
            {formContent}
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = carouselData[currentIndex];
  const nextIndex = (currentIndex + 1) % carouselData.length;
  const nextSlide = carouselData[nextIndex];

  return (
    <section className="login-page min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-2 md:px-0">
      <div className="login-box bg-[var(--light-dark-color)] p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-[20px] border border-[var(--light-blur-grey-color)] shadow-lg shadow-[var(--puprle-color)]/20 w-full max-w-5xl">
        {/* Left Side - Carousel */}
        <div className="carousel-part md:pr-2 h-[530px] flex items-center justify-center">
          <div className="carousel bg-[var(--puprle-color)] rounded-[20px] py-3 w-full h-full flex items-center relative overflow-hidden">
            
            {/* Current Slide */}
            <div
              key={`current-${currentIndex}`}
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${
                isTransitioning ? '-translate-x-full' : 'translate-x-0'
              }`}
            >
              <div className="cards px-4 md:px-7 py-6 flex flex-col h-full justify-between w-full">
                <div className="contents">
                  <h3 className="font-bold text-2xl md:text-3xl text-[var(--white-color)] mb-2 leading-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="font-medium text-sm md:text-base text-[var(--white-color)] mb-5">
                    {currentSlide.desc}
                  </p>
                </div>
                <div className="card-image rounded-xl overflow-hidden h-[180px] md:h-[250px] flex justify-center items-center bg-white/10">
                  <img 
                    src={currentSlide.img} 
                    alt={currentSlide.title} 
                    className="object-cover w-full h-full" 
                  />
                </div>
              </div>
            </div>

            {/* Next Slide */}
            <div
              key={`next-${nextIndex}`}
              className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${
                isTransitioning ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="cards px-4 md:px-7 py-6 flex flex-col h-full justify-between w-full">
                <div className="contents">
                  <h3 className="font-bold text-2xl md:text-3xl text-[var(--white-color)] mb-2 leading-tight">
                    {nextSlide.title}
                  </h3>
                  <p className="font-medium text-sm md:text-base text-[var(--white-color)] mb-5">
                    {nextSlide.desc}
                  </p>
                </div>
                <div className="card-image rounded-xl overflow-hidden h-[180px] md:h-[250px] flex justify-center items-center bg-white/10">
                  <img 
                    src={nextSlide.img} 
                    alt={nextSlide.title} 
                    className="object-cover w-full h-full" 
                  />
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 absolute left-0 right-0 bottom-4 z-30">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  className={`w-[40px] h-[2px] rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-white scale-110' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  } ${isTransitioning ? 'pointer-events-none' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-part md:pl-2 flex flex-col items-center justify-center w-full">
          <div className="header-content flex flex-col justify-center items-center mt-4 md:mt-8 mb-2">
            <img src={logo} alt={settings?.general?.siteName || 'logo'} className="w-[120px] md:w-[150px] mb-2"/>
            <h2 className="welcome-back text-white text-[30px] font-sans font-bold">{pageTitle}</h2>
            <p className="welcome-back text-[10px] font-mono text-[#ffffff9e] font-bold">{pageSubtitle}</p>
          </div>
          {formContent}
        </div>
      </div>
    </section>
  );
};

export default AuthFormContainer;