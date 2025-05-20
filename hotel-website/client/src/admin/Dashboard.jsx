/**
 * Admin Dashboard Component
 * 
 * This component displays the administrative dashboard for managing hotel bookings.
 * It provides functionality to view, search, filter, and update the status of bookings.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Dashboard Component
 * @param {Object} props - Component props
 * @param {Function} props.onLogout - Function to call when user logs out or session expires
 */
const Dashboard = ({ onLogout }) => {
  // State for bookings data and UI control
  const [bookings, setBookings] = useState([]);          // All bookings from the API
  const [isLoading, setIsLoading] = useState(true);      // Loading state
  const [error, setError] = useState('');               // Error message
  const [statusFilter, setStatusFilter] = useState('all'); // Filter by booking status
  const [searchTerm, setSearchTerm] = useState('');      // Search term for filtering
  
  /**
   * Effect to load bookings data when component mounts
   */
  useEffect(() => {
    fetchBookings();
  }, []); // Empty dependency array ensures this only runs once on component mount
  
  /**
   * Fetches booking data from the API
   * Automatically handles authentication errors by logging out
   */
  const fetchBookings = async () => {
    try {
      // Show loading indicator
      setIsLoading(true);
      
      // Get authentication token from local storage
      const token = localStorage.getItem('adminToken');
      
      // If no token exists, log out immediately
      if (!token) {
        onLogout();
        return;
      }
      
      // Make authenticated request to get bookings data
      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}` // Add token to request headers
        }
      });
      
      // Update state with fetched bookings
      setBookings(response.data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching bookings:', error);
      
      // Handle authentication errors specifically
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Session expired or unauthorized. Please log in again.');
        // Auto logout after a short delay to allow user to see the error message
        setTimeout(() => {
          onLogout();
        }, 3000);
      } else {
        // Handle other types of errors
        setError('Failed to load bookings. Please try again.');
      }
    } finally {
      // Hide loading indicator regardless of outcome
      setIsLoading(false);
    }
  };
  
  /**
   * Updates the status of a booking
   * 
   * @param {string} bookingId - ID of the booking to update
   * @param {string} newStatus - New status to set (pending, confirmed, cancelled, completed)
   */
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      // Get authentication token
      const token = localStorage.getItem('adminToken');
      
      // Send update request to API
      await axios.put(`http://localhost:5000/api/admin/bookings/${bookingId}`, 
        { status: newStatus }, // Request body with new status
        {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to request headers
          }
        }
      );
      
      // Update the booking in local state to avoid refetching all data
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? {...booking, status: newStatus, updatedAt: new Date().toISOString()} 
            : booking
        )
      );
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };
  
  /**
   * Handles search input changes
   * 
   * @param {Event} e - Input change event
   */
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  /**
   * Handles status filter selection changes
   * 
   * @param {Event} e - Select change event
   */
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  /**
   * Handles keyboard events for accessibility
   * 
   * @param {KeyboardEvent} e - Keyboard event
   * @param {Function} action - Function to call if key is Enter or Space
   */
  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      action();
    }
  };
  
  /**
   * Filters bookings based on search term and status filter
   * This computed value is derived from the bookings array and filter states
   */
  const filteredBookings = bookings.filter(booking => {
    // Check if booking matches search term (by name, email, or phone)
    const matchesSearch = 
      booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);
      
    // Check if booking matches status filter
    const matchesFilter = statusFilter === 'all' || booking.status === statusFilter;
    
    // Only include bookings that match both conditions
    return matchesSearch && matchesFilter;
  });
  
  /**
   * Formats a date string to a human-readable format
   * 
   * @param {string} dateString - ISO date string
   * @return {string} Formatted date
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  /**
   * Returns CSS class names for status badges based on status value
   * 
   * @param {string} status - Booking status (pending, confirmed, cancelled, completed)
   * @return {string} CSS class names
   */
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  /**
   * Calculates the number of nights between check-in and check-out dates
   * 
   * @param {string} checkIn - Check-in date (YYYY-MM-DD)
   * @param {string} checkOut - Check-out date (YYYY-MM-DD)
   * @return {number} Number of nights
   */
  const nightsCount = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Render the dashboard UI
   */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with title and logout button */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Alpine Athletics Resort Admin</h1>
          <button 
            onClick={onLogout}
            onKeyDown={(e) => handleKeyDown(e, onLogout)}
            className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            tabIndex="0"
            aria-label="Log out"
          >
            Log Out
          </button>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-6">Booking Requests</h2>
          
          {/* Error message display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-4">
            {/* Search input */}
            <div className="md:w-1/2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by name, email or phone
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter search term..."
              />
            </div>
            
            {/* Status filter dropdown */}
            <div className="md:w-1/3">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {/* Refresh button */}
            <div className="md:w-auto flex items-end">
              <button 
                onClick={fetchBookings}
                onKeyDown={(e) => handleKeyDown(e, fetchBookings)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                tabIndex="0"
                aria-label="Refresh booking list"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Conditional rendering based on loading state and results */}
          {isLoading ? (
            // Loading spinner
            <div className="py-20 text-center">
              <svg className="animate-spin h-10 w-10 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            // No results message
            <div className="py-20 text-center">
              <p className="text-xl text-gray-600">No bookings found</p>
              {searchTerm || statusFilter !== 'all' ? (
                <p className="mt-2 text-gray-500">Try adjusting your search or filter</p>
              ) : null}
            </div>
          ) : (
            // Bookings table
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {/* Table body - mapping through filtered bookings */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      {/* Guest information */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                        <div className="text-sm text-gray-500">{booking.phone}</div>
                      </td>
                      {/* Stay dates */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {nightsCount(booking.checkIn, booking.checkOut)} nights
                        </div>
                      </td>
                      {/* Price information */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${booking.totalPrice || (nightsCount(booking.checkIn, booking.checkOut) * 350)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ($350/night)
                        </div>
                      </td>
                      {/* Status badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status || 'pending'}
                        </span>
                      </td>
                      {/* Booking creation date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(booking.createdAt)}
                      </td>
                      {/* Action buttons */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {/* Confirm button - only show if not already confirmed */}
                          {booking.status !== 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 focus:outline-none focus:underline"
                              aria-label={`Confirm booking for ${booking.fullName}`}
                            >
                              Confirm
                            </button>
                          )}
                          {/* Cancel button - only show if not already cancelled */}
                          {booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                              aria-label={`Cancel booking for ${booking.fullName}`}
                            >
                              Cancel
                            </button>
                          )}
                          {/* Complete button - only show for confirmed bookings that aren't completed */}
                          {(booking.status === 'confirmed' && booking.status !== 'completed') && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                              aria-label={`Mark booking for ${booking.fullName} as completed`}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
