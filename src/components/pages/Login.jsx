import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import formImg from '../../assets/image/common/form-carousel-card.jpg';
import logoImg from '../../assets/image/logo/bookadzone-logo.png';
import { Link } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { FaSquareFacebook } from 'react-icons/fa6';

const Login = () => {
  return (
    <section className='login-page flex h-[100dvh] flex flex-col justify-center items-center px-55'>
       <div className="login-box bg-[var(--light-dark-color)] p-7 grid grid-cols-2 gap-4 rounded-[20px] border-[1px] border-[var(--light-blur-grey-color)]">
          <div class="carousel-part pr-2">
             <div className="carousel bg-[var(--puprle-color)] rounded-[20px] py-3">
                  <Swiper 
                  modules={[Autoplay, Pagination]}
                  autoplay={{
                     delay: 3000,
                     disableOnInteraction: false,
                  }}
                  grabCursor={true}
                  pagination={{ clickable: true }}
                  className="mySwiper"
                  >
                    <SwiperSlide>
                       <div className="cards px-7 py-6">
                          <div className="contents">
                             <h3 className='font-bold text-[1.55rem] text-[var(--white-color)] mb-2'>Map Your Reach. Maximize Your Impact.</h3>
                             <p className='font-medium text-[.70rem] text-[var(--white-color)] mb-5'>Quickly explore and book hoardings directly from the interactive map.</p>
                          </div>

                          <div className="card-image rounded-[20px] overflow-hidden h-[250px] flex justify-center flex-col">
                             <img src={formImg} alt="" className='object-cover' />
                          </div>
                       </div>
                    </SwiperSlide>

                    <SwiperSlide>
                       <div className="cards px-7 py-6">
                          <div className="contents">
                             <h3 className='font-bold text-[1.55rem] text-[var(--white-color)] mb-2'>Map Your Reach. Maximize Your Impact.</h3>
                             <p className='font-medium text-[.70rem] text-[var(--white-color)] mb-5'>Quickly explore and book hoardings directly from the interactive map.</p>
                          </div>

                          <div className="card-image rounded-[20px] overflow-hidden h-[250px] flex justify-center flex-col">
                             <img src={formImg} alt="" className='object-cover' />
                          </div>
                       </div>
                    </SwiperSlide>

                    <SwiperSlide>
                       <div className="cards px-7 py-6">
                          <div className="contents">
                             <h3 className='font-bold text-[1.55rem] text-[var(--white-color)] mb-2'>Map Your Reach. Maximize Your Impact.</h3>
                             <p className='font-medium text-[.70rem] text-[var(--white-color)] mb-5'>Quickly explore and book hoardings directly from the interactive map.</p>
                          </div>

                          <div className="card-image rounded-[20px] overflow-hidden h-[250px] flex justify-center flex-col">
                             <img src={formImg} alt="" className='object-cover' />
                          </div>
                       </div>
                    </SwiperSlide>
                  </Swiper>
             </div>
          </div>
          <div class="form-part pl-2 flex flex-col items-center justify-between w-full">
             <div className="header-content flex flex-col justify-center items-center mt-8">
                  <img src={logoImg} alt="bookadzone-logo" className='w-[150px] mb-2' />
                  <h4 className='text-[1.6rem] font-medium text-[var(--white-color)] mb-2'>Welcome Back!</h4>
                  <span className='text-[.65rem] text-[var(--light-grey-color)]'>Please Login to your account</span>
             </div>

             <form action="" className='flex flex-col justify-center items-center w-full'>
               
                <div className="input-group bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] mb-4 w-[90%]">
                  <input type="email" className='outline-none w-full p-3 text-[.75rem] text-[var(--white-color)] placeholder:text-[var(--light-grey-color)]' placeholder='Enter Your Email' />
                </div>

                <div className="input-group bg-[var(--light-dark-color)] border-[1px] border-[var(--light-blur-grey-color)] rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] mb-4 w-[90%]">
                  <input type="password" className='outline-none w-full p-3 text-[.75rem] text-[var(--white-color)] placeholder:text-[var(--light-grey-color)]' placeholder='Enter Your Password' />
                </div>

                <div className="forgot-link w-[90%] flex justify-end mb-4">
                  <Link to="/forgot-password" className='text-[.50rem] text-[var(--light-grey-color)] hover:text-[var(--white-color)] underline transition-all duration-300 ease-in ease-out'>Forgot Password?</Link>
                </div>

                <div className="button-group w-[90%]">
                  <button className='p-3 bg-[var(--puprle-color)] text-[var(--white-color)] font-medium text-[.75rem] cursor-pointer rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] w-full'>Login</button>
                </div>

                <div className="login-with relative w-[50%] flex justify-center items-center my-4">
                   <span className='text-[.50rem] text-[var(--light-grey-color)]'>Or Login With</span>
                </div>

                <div className="login-method">
                     <div className="login-methods flex justify-center items-center gap-4">
                        <Link to="/login/google" className='px-5 py-2 rounded-[5px] bg-[var(--white-color)] font-medium text-[.65rem] cursor-pointer flex items-center gap-2 font-semibold'> <FcGoogle className='text-[1.2rem]'/> Google</Link>
                        <Link to="/login/facebook" className='px-5 py-2 rounded-[5px] bg-[#1877F2] text-[var(--white-color)] font-medium text-[.65rem] cursor-pointer flex items-center gap-2 font-semibold'><FaSquareFacebook className='text-[1.2rem]' /> Facebook</Link>
                     </div>
                </div>

                <div className="already-have-account mt-3">
                     <span className='text-[.50rem] text-[var(--light-grey-color)]'>Don't have an account? <Link to="/register" className='text-[var(--puprle-color)] font-medium underline'>Register Now</Link></span>
                </div>
             </form>
          </div>
       </div> 
    </section>
  )
}

export default Login;