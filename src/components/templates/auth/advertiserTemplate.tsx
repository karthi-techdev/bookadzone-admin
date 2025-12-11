import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const carouselData = [
  {
    title: "Map Your Reach. Maximize Your Impact.",
    desc: "Quickly explore and book hoardings directly from the interactive map.",
    img: "/assets/image/common/form-carousel-card.jpg",
  },
  {
    title: "Find the Best Locations",
    desc: "Discover top advertising spots with ease and confidence.",
    img: "/assets/image/common/form-carousel-card.jpg",
  },
  {
    title: "Book Instantly",
    desc: "Secure your hoarding space in just a few clicks.",
    img: "/assets/image/common/form-carousel-card.jpg",
  },
];

function Carousel() {
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
        className={`w-full transition-all duration-700 ease-in-out transform ${
          isSliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2 leading-snug">
          {title}
        </h2>
        <p className="text-white text-sm mb-4">{desc}</p>
        <div className="rounded-[10px] overflow-hidden w-full max-w-sm mx-auto shadow-lg">
          <img src={img} alt="carousel" className="w-full h-[250px] object-cover" />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-5 absolute bottom-4">
        {carouselData.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-[3px] w-[40px] w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}

export default function Advertiser() {
  const [method, setMethod] = useState("Email");

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--main-bg-color)] px-4">
      <div className="bg-[var(--light-dark-color)] border border-white/40 h-[600px] rounded-2xl shadow-lg flex max-w-5xl w-full overflow-hidden">
        
        <div className="hidden md:flex flex-col justify-center ml-7.5 rounded-[30px] h-[590px]  items-center flex-1 p-8">
          <Carousel />
        </div>

        <div className="flex flex-col justify-center flex-1 p-8 leading-[80px]">
          <div className="flex justify-center mb-3">
            <img
              src="/assets/image/logo/bookadzone-logo.png"
              alt="BookAdZone Logo"
              className="w-50"
            />
          </div>

          <h2 className="text-white text-[30px] text-2xl font-bold mb-2 text-center">
            Register as
          </h2>
          <p className="text-gray-400 text-sm mb-6 text-center text-[10px]">
            Select your role to proceed
          </p>

          <div className="relative mb-6">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-4 bg-[var(--light-dark-color)] rounded-[7px_30px_7px_30px] border border-gray-600 text-white focus:outline-none"
              >
                <option >Advertiser</option>
                <option>Agency</option>
            </select>
          </div>
          <div className="already-have-account mt-3 text-center w-full">
                        <span className="text-[10px] text-[var(--light-grey-color)]">
                          Don't have an account?{' '}
                          <Link to="/register" className="text-[var(--puprle-color)] underline">
                            Signup
                          </Link>
                        </span>
                      </div>

        
        </div>
      </div>
    </section>
  );
}
