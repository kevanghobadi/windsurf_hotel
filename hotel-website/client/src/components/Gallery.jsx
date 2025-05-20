import { useState } from 'react';

const Gallery = () => {
  const [activeImage, setActiveImage] = useState(null);
  
  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1540539234-c14a20fb7c7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Stunning mountain view from fitness center",
      category: "Fitness"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Luxury hotel room with workout equipment",
      category: "Room"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Group hiking on mountain trails",
      category: "Activities"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Refreshing indoor pool with mountain views",
      category: "Wellness"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1581417478175-a9ef18f210c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Rock climbing adventure near the resort",
      category: "Activities"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Hotel restaurant with healthy meal options",
      category: "Dining"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Yoga session on outdoor terrace",
      category: "Wellness"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1549638441-b787d2e11f14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      alt: "Mountain biking trails near the hotel",
      category: "Activities"
    }
  ];

  const openLightbox = (image) => {
    setActiveImage(image);
    // Prevent background scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    } else if (e.key === 'Escape' && activeImage) {
      closeLightbox();
    }
  };

  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(galleryImages.map(img => img.category))];
  
  const filteredImages = filter === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <section id="gallery" className="section-container">
      <div className="text-center mb-12">
        <h2 className="section-heading">Our Gallery</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our athletic-focused hotel through these captivating images of our facilities, activities, and surroundings.
        </p>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            onKeyDown={(e) => handleKeyDown(e, () => setFilter(category))}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent ${
              filter === category 
                ? 'bg-accent text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={filter === category}
            tabIndex="0"
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredImages.map(image => (
          <div 
            key={image.id} 
            className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 aspect-square cursor-pointer"
            onClick={() => openLightbox(image)}
            onKeyDown={(e) => handleKeyDown(e, () => openLightbox(image))}
            tabIndex="0"
            role="button"
            aria-label={`View ${image.alt}`}
          >
            <img 
              src={image.src} 
              alt={image.alt} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
      
      {/* Lightbox */}
      {activeImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl max-h-screen"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-colors duration-300"
              onClick={closeLightbox}
              onKeyDown={(e) => handleKeyDown(e, closeLightbox)}
              aria-label="Close lightbox"
              tabIndex="0"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={activeImage.src} 
              alt={activeImage.alt} 
              className="max-h-[80vh] mx-auto rounded-lg"
            />
            <div className="mt-4 text-white text-center">
              <p>{activeImage.alt}</p>
              <p className="text-sm text-gray-300">{activeImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
