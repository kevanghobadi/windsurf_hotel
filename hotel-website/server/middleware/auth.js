/**
 * Authentication Middleware
 * 
 * This module provides a simple authentication middleware for protecting admin routes.
 * In a production environment, this would be replaced with a more secure solution using
 * JWT tokens, OAuth, or similar authentication protocols with proper password hashing.
 * 
 * For this demo, we're using a simple hardcoded password verification.
 */

/**
 * Authentication middleware function
 * Verifies that requests to protected routes contain a valid authorization header
 * with the correct password value.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = (req, res, next) => {
  // Extract the Authorization header from the request
  // Expected format: "Bearer Password1"
  const bearerHeader = req.headers['authorization'];
  
  // Check if the Authorization header exists
  if (typeof bearerHeader !== 'undefined') {
    // Split the header value by space to separate "Bearer" from the token
    const bearer = bearerHeader.split(' ');
    
    // Get the token part (should be the second element in the array)
    const bearerToken = bearer[1];
    
    // Verify the token against our hardcoded password
    // In a real application, this would compare against a hashed password or verify a JWT
    if (bearerToken === 'Password1') {
      // If valid, proceed to the next middleware/route handler
      next();
    } else {
      // If invalid password, return 403 Forbidden
      res.status(403).json({ 
        message: 'Forbidden: Invalid credentials' 
      });
    }
  } else {
    // If no Authorization header is provided, return 401 Unauthorized
    res.status(401).json({ 
      message: 'Unauthorized: No credentials provided' 
    });
  }
};

// Export the middleware function
module.exports = auth;
