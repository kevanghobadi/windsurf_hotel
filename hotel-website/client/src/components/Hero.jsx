import { useState, useEffect } from 'react';

const Hero = ({ onRequestRoom }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      title: 'Elevate Your Stay',
      subtitle: 'Athletic-Focused Luxury Hotel Experience'
    },
    {
      image: 'https://images.unsplash.com/photo-1574259392081-dbe3c19cd15e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      title: 'Scenic Views',
      subtitle: 'Breathtaking Locations for Adventure Enthusiasts'
    },
    {
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80',
      title: 'Fitness Forward',
      subtitle: 'State-of-the-Art Facilities for Your Workout Needs'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleRequestRoomClick = () => {
    onRequestRoom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRequestRoomClick();
    }
  };

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleSlideKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleSlideChange(index);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={slide.image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              <button
                onClick={handleRequestRoomClick}
                onKeyDown={handleKeyDown}
                className="btn-primary"
                tabIndex="0"
                aria-label="Request a room"
              >
                Book Your Stay - $350/night
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            onKeyDown={(e) => handleSlideKeyDown(e, index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
            tabIndex="0"
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
