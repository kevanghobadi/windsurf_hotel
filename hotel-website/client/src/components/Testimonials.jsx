import { useState } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Marathon Runner",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      quote: "The Alpine Athletics Resort was the perfect accommodation for my marathon training retreat. The trails accessible from the property were challenging and beautiful, and the recovery amenities helped me stay in peak condition."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Rock Climbing Enthusiast",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "I was blown away by the attention to detail for athletes. The gear storage, custom meal options, and proximity to climbing spots made this hotel ideal. The staff even helped arrange climbing guides for us!"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Yoga Instructor",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      quote: "I hosted a yoga retreat here and my students were delighted. The Wellness Rooms provided the perfect environment for relaxation after sessions, and the mountain views were incredibly inspiring during our sunrise practices."
    },
    {
      id: 4,
      name: "David Wilson",
      role: "Mountain Biker",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      quote: "As an avid mountain biker, finding accommodations that cater to my needs is rare. The bike storage, wash station, repair tools, and trail maps made this place special. I'll definitely be back next season!"
    }
  ];
  
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    }
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  const handleDotKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleDotClick(index);
    }
  };
  
  return (
    <section className="section-container bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="section-heading">What Our Guests Say</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Read testimonials from athletes and outdoor enthusiasts who have experienced our unique accommodations.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="h-96 md:h-80 overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`absolute inset-0 transition-opacity duration-500 flex flex-col items-center justify-center px-6 ${
                index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              aria-hidden={index !== activeIndex}
            >
              <div className="text-center">
                <img
                  src={testimonial.avatar}
                  alt={`${testimonial.name} avatar`}
                  className="h-20 w-20 rounded-full mx-auto mb-4 object-cover border-4 border-accent"
                />
                <blockquote className="text-lg italic text-gray-700 mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div className="font-semibold text-primary">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between z-20 pointer-events-none">
          <button
            onClick={handlePrev}
            onKeyDown={(e) => handleKeyDown(e, handlePrev)}
            className="bg-white rounded-full p-2 shadow-md text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent pointer-events-auto transition-all duration-300"
            aria-label="Previous testimonial"
            tabIndex="0"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            onKeyDown={(e) => handleKeyDown(e, handleNext)}
            className="bg-white rounded-full p-2 shadow-md text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent pointer-events-auto transition-all duration-300"
            aria-label="Next testimonial"
            tabIndex="0"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Dots navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              onKeyDown={(e) => handleDotKeyDown(e, index)}
              className={`h-3 w-3 rounded-full focus:outline-none focus:ring-2 focus:ring-accent ${
                index === activeIndex ? 'bg-accent' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              tabIndex="0"
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
