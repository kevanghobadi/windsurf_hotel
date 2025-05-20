import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Rooms from './components/Rooms';
import BookingForm from './components/BookingForm';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Footer from './components/Footer';

function App() {
  const [bookingFormVisible, setBookingFormVisible] = useState(false);
  
  const handleRequestRoom = () => {
    setBookingFormVisible(true);
    // Scroll to booking form
    document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar onRequestRoom={handleRequestRoom} />
      <Hero onRequestRoom={handleRequestRoom} />
      <Features />
      <Rooms onRequestRoom={handleRequestRoom} />
      <section id="booking-section" className="section-container">
        <div className="text-center mb-10">
          <h2 className="section-heading">Book Your Stay</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Experience luxury accommodations designed for the active lifestyle with our athletic-focused amenities.</p>
        </div>
        <BookingForm visible={bookingFormVisible} setVisible={setBookingFormVisible} />
      </section>
      <Testimonials />
      <Gallery />
      <Footer />
    </div>
  );
}

export default App;
