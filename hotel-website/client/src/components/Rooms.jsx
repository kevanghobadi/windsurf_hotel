const Rooms = ({ onRequestRoom }) => {
  const rooms = [
    {
      id: 1,
      name: "Athletic Suite",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Our premium suite features a king bed, dedicated workout area with essential equipment, recovery amenities, and mountain views.",
      features: ["In-room exercise equipment", "Recovery station", "Mountain view", "King bed", "Spa bathroom"],
      price: 500
    },
    {
      id: 2,
      name: "Adventure Room",
      image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Perfect for outdoor enthusiasts, this room offers direct trail access, gear storage, and all the comforts you need after a day of adventure.",
      features: ["Trail access", "Gear storage", "Queen bed", "Rain shower", "Trail maps"],
      price: 275
    },
    {
      id: 3,
      name: "Wellness Room",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      description: "Designed for relaxation and recovery, featuring ultra-comfortable bedding, in-room wellness amenities, and serene forest views.",
      features: ["Meditation corner", "Aromatherapy", "Blackout curtains", "Queen bed", "Forest view"],
      price: 350
    }
  ];

  const handleRequestRoom = () => {
    onRequestRoom();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRequestRoom();
    }
  };

  return (
    <section id="rooms" className="section-container">
      <div className="text-center mb-12">
        <h2 className="section-heading">Premium Accommodations</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our range of rooms starting at $275 per night, all featuring athletic-focused amenities for the active traveler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-64">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Room Features:</h4>
                <ul className="space-y-1">
                  {room.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="h-4 w-4 text-accent mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                <p className="text-lg font-bold text-primary mb-4">${room.price} per night</p>
                <button
                  onClick={handleRequestRoom}
                  onKeyDown={handleKeyDown}
                  className="w-full btn-primary"
                  tabIndex="0"
                  aria-label={`Request to book ${room.name}`}
                >
                  Request Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Rooms;
