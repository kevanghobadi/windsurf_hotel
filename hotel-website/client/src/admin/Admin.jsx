/**
 * Admin Component
 * 
 * This is the main container component for the admin section of the application.
 * It manages authentication state and renders either the Login or Dashboard component
 * based on the user's authentication status.
 */

import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';

const Admin = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  /**
   * Effect to check if user is already logged in when component mounts
   * Looks for an adminToken in localStorage as a simple form of persistent authentication
   */
  useEffect(() => {
    // Check localStorage for existing token
    const token = localStorage.getItem('adminToken');
    
    // If token exists, set logged in state to true
    if (token) {
      setIsLoggedIn(true);
    }
  }, []); // Empty dependency array ensures this only runs once on component mount

  /**
   * Handler for successful login
   * Called by the Login component when authentication succeeds
   */
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  /**
   * Handler for logout
   * Removes the admin token from localStorage and updates state
   */
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('adminToken');
    
    // Update state to show login screen
    setIsLoggedIn(false);
  };

  // Render either Dashboard or Login based on authentication state
  return (
    <div>
      {isLoggedIn ? (
        // If logged in, show the dashboard with logout handler
        <Dashboard onLogout={handleLogout} />
      ) : (
        // If not logged in, show the login form with success handler
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default Admin;
