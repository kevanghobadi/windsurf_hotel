/**
 * Admin Login Component
 * 
 * This component provides a login interface for the admin dashboard.
 * It handles password validation against the backend API and manages login state.
 * For this demo, authentication is done with a simple password check.
 */

import { useState } from 'react';
import axios from 'axios';

/**
 * Login Component
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback function to execute on successful login
 */
const Login = ({ onLoginSuccess }) => {
  // State for form input, error messages, and loading status
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle password input change
   * Updates password state and clears error messages
   * 
   * @param {Event} e - Input change event
   */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear any error messages when user starts typing
    if (error) setError('');
  };

  /**
   * Handle key down events in the password field
   * Allows submitting the form by pressing Enter
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  /**
   * Handle login form submission
   * Validates password locally, then sends login request to the API
   */
  const handleLogin = async () => {
    // Validate that password is not empty
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      // Set loading state and clear errors
      setIsLoading(true);
      setError('');

      // Send login request to the backend API
      const response = await axios.post('http://localhost:5000/api/admin/login', { password });
      
      // Check if login was successful
      if (response.data.success) {
        // Store the authentication token in localStorage for persistence
        localStorage.setItem('adminToken', response.data.token);
        
        // Notify parent component of successful login
        onLoginSuccess();
      } else {
        // Handle unsuccessful login with explicit success: false response
        setError('Invalid credentials');
      }
    } catch (error) {
      // Handle API errors
      console.error('Login error:', error);
      // Display error message from API or fallback to generic message
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      // Reset loading state regardless of outcome
      setIsLoading(false);
    }
  };

  // Render login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Admin Login</h2>
          <p className="text-gray-600 mt-2">Alpine Athletics Resort</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
              autoComplete="current-password"
              aria-required="true"
            />
            {/* Error message display */}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label="Log in"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          
          {/* Link back to main website */}
          <div className="text-center mt-4">
            <a 
              href="/" 
              className="text-sm text-primary hover:text-accent transition-colors duration-300"
              aria-label="Return to main website"
            >
              Return to main website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
