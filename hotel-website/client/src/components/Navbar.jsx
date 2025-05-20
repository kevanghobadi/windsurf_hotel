import { useState, useEffect } from 'react';

const Navbar = ({ onRequestRoom }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleMobileMenuToggle();
    }
  };

  const handleRequestRoomClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    onRequestRoom();
  };

  const handleRequestRoomKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRequestRoomClick();
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-primary">Alpine Athletics Resort</span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-800 hover:text-accent transition-colors">About</a>
            <a href="#amenities" className="text-gray-800 hover:text-accent transition-colors">Amenities</a>
            <a href="#rooms" className="text-gray-800 hover:text-accent transition-colors">Rooms</a>
            <a href="#gallery" className="text-gray-800 hover:text-accent transition-colors">Gallery</a>
            <button 
              onClick={handleRequestRoomClick} 
              className="btn-primary"
              aria-label="Request a room"
            >
              Request a Room
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              type="button" 
              onClick={handleMobileMenuToggle}
              onKeyDown={handleKeyDown}
              className="text-gray-800 hover:text-accent focus:outline-none"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              tabIndex="0"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            <a href="#about" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md">About</a>
            <a href="#amenities" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md">Amenities</a>
            <a href="#rooms" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md">Rooms</a>
            <a href="#gallery" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 rounded-md">Gallery</a>
            <button 
              onClick={handleRequestRoomClick}
              onKeyDown={handleRequestRoomKeyDown}
              className="block w-full text-left px-3 py-2 text-accent font-medium hover:bg-gray-100 rounded-md"
              tabIndex="0"
              aria-label="Request a room"
            >
              Request a Room
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
