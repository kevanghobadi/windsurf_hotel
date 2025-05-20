import { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = ({ visible, setVisible }) => {
  // Room types with different price points
  const roomTypes = [
    { id: 2, name: "Adventure Room", price: 275 },
    { id: 3, name: "Wellness Room", price: 350 },
    { id: 1, name: "Athletic Suite", price: 500 }
  ];
  
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0].id); // Default to Adventure Room
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    message: '',
    roomType: roomTypes[0].name
  });
  
  // Update room type in form data when selected room changes
  useEffect(() => {
    const selectedRoom = roomTypes.find(room => room.id === selectedRoomType);
    if (selectedRoom) {
      setFormData(prev => ({
        ...prev,
        roomType: selectedRoom.name
      }));
    }
  }, [selectedRoomType]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[()-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.checkIn) {
      newErrors.checkIn = 'Check-in date is required';
    }
    
    if (!formData.checkOut) {
      newErrors.checkOut = 'Check-out date is required';
    } else if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    
    if (checkOut <= checkIn) return 0;
    
    // Calculate the difference in days
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nightsCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Get the current room price based on selection
    const selectedRoom = roomTypes.find(room => room.id === selectedRoomType);
    const pricePerNight = selectedRoom ? selectedRoom.price : 275; // Default to lowest price if not found
    
    return nightsCount * pricePerNight;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Calculate price
      const totalPrice = calculateTotalPrice();
      
      // Submit to backend API
      const response = await axios.post('http://localhost:5000/api/bookings', {
        ...formData,
        totalPrice
      });
      
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          checkIn: '',
          checkOut: '',
          message: ''
        });
      } else {
        setSubmitError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError(
        error.response?.data?.message || 
        'Failed to submit your booking request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleClose = () => {
    setVisible(false);
    setSubmitSuccess(false);
    setSubmitError('');
  };
  
  const minDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 lg:p-8 max-w-2xl mx-auto transition-all duration-300 ${
      visible ? 'opacity-100 scale-100' : 'opacity-90 scale-95'
    }`}>
      {submitSuccess ? (
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="mt-4 text-xl font-semibold text-primary">Booking Request Received!</h3>
          <p className="mt-2 text-gray-600">
            Thank you for your booking request. We'll contact you shortly to confirm your reservation.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 btn-primary"
            aria-label="Close booking form"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-semibold text-primary mb-6">Request a Room</h3>
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                  aria-required="true"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? "fullName-error" : undefined}
                />
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-600">
                    {errors.fullName}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(123) 456-7890"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="checkIn" className="block mb-2 text-sm font-medium text-gray-700">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  id="checkIn"
                  name="checkIn"
                  value={formData.checkIn}
                  min={minDate()}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.checkIn ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-invalid={!!errors.checkIn}
                  aria-describedby={errors.checkIn ? "checkIn-error" : undefined}
                />
                {errors.checkIn && (
                  <p id="checkIn-error" className="mt-1 text-sm text-red-600">
                    {errors.checkIn}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="checkOut" className="block mb-2 text-sm font-medium text-gray-700">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  id="checkOut"
                  name="checkOut"
                  value={formData.checkOut}
                  min={formData.checkIn || minDate()}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.checkOut ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-invalid={!!errors.checkOut}
                  aria-describedby={errors.checkOut ? "checkOut-error" : undefined}
                />
                {errors.checkOut && (
                  <p id="checkOut-error" className="mt-1 text-sm text-red-600">
                    {errors.checkOut}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="roomType" className="block mb-2 text-sm font-medium text-gray-700">
                  Room Type *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {roomTypes.map((room) => (
                    <div key={room.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${selectedRoomType === room.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-400'}`}
                      onClick={() => setSelectedRoomType(room.id)}
                    >
                      <div className="font-medium text-gray-900">{room.name}</div>
                      <div className="text-accent font-bold mt-1">${room.price}/night</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">
                  Special Requests (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Any special requests or questions?"
                ></textarea>
              </div>
            </div>
            
            {formData.checkIn && formData.checkOut && new Date(formData.checkOut) > new Date(formData.checkIn) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Total Estimation:</p>
                    <p className="text-lg font-semibold text-primary">${calculateTotalPrice()}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    ${roomTypes.find(room => room.id === selectedRoomType)?.price} × {Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24))} nights
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                aria-label="Cancel booking request"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
                aria-label="Submit booking request"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default BookingForm;
