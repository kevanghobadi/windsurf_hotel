/**
 * Alpine Athletics Resort - Server
 * 
 * This is the main server file for the Alpine Athletics Resort website.
 * It provides API endpoints for booking management and admin operations.
 * 
 * The server uses Express.js with a file-based JSON storage system.
 */

// Required dependencies
const express = require('express');        // Web server framework
const cors = require('cors');             // Cross-Origin Resource Sharing middleware
const bodyParser = require('body-parser'); // Request body parsing middleware
const fs = require('fs').promises;        // File system operations with promises
const path = require('path');             // Path manipulation utilities
const auth = require('./middleware/auth'); // Custom authentication middleware

// Initialize Express application
const app = express();

// Set server port, use environment variable if available or default to 5000
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(cors());                         // Enable CORS for all routes
app.use(bodyParser.json());              // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory

// Define data storage paths
const dataDir = path.join(__dirname, 'data');                 // Directory for data storage
const bookingsFile = path.join(dataDir, 'bookings.json');     // File to store booking data
const adminCredentialsFile = path.join(dataDir, 'admin.json'); // File for admin credentials (unused in this version)

/**
 * Ensures that the data directory and initial data files exist
 * 
 * This function creates the data directory if it doesn't exist and initializes
 * an empty bookings.json file if needed. This prevents errors when reading from
 * or writing to these files for the first time.
 * 
 * @async
 * @return {Promise<void>}
 */
const ensureDataDirExists = async () => {
  try {
    // Create the data directory if it doesn't exist
    // The recursive option ensures parent directories are created as needed
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if bookings.json exists
    try {
      // Try to access the file - will throw an error if it doesn't exist
      await fs.access(bookingsFile);
    } catch (error) {
      // If bookings.json doesn't exist, create it with an empty array
      await fs.writeFile(bookingsFile, JSON.stringify([]));
    }
  } catch (error) {
    // Log any errors that occur during directory/file creation
    console.error('Error creating data directory:', error);
  }
};

/**
 * API Routes
 * 
 * The following section defines all the API endpoints for the application.
 * Routes are organized by functionality and access level (public vs. admin).
 */

/**
 * Root endpoint - Health check
 * GET /
 * 
 * Simple route to confirm the API server is running
 */
app.get('/', (req, res) => {
  res.send('Alpine Athletics Resort API is running!');
});

/**
 * Admin Authentication Endpoint
 * POST /api/admin/login
 * 
 * Handles admin login requests by validating the provided password
 * Returns a token that can be used for subsequent admin API requests
 * 
 * Request body: { password: string }
 * Success response: { success: true, token: string, message: string }
 * Error response: { success: false, message: string }
 */
app.post('/api/admin/login', (req, res) => {
  // Extract the password from the request body
  const { password } = req.body;
  
  // Verify the password against our hardcoded value
  // Note: In a production application, this would use proper password hashing
  if (password === 'Password1') {
    // If password matches, return success with a token
    res.json({ 
      success: true, 
      token: 'Password1', // Simple token approach for this demo only
      message: 'Login successful'
    });
  } else {
    // If password doesn't match, return unauthorized error
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

/**
 * Admin: Get All Bookings
 * GET /api/admin/bookings
 * 
 * Protected route that returns all booking data for admin dashboard
 * Requires authentication via the auth middleware
 * 
 * Headers required: { Authorization: 'Bearer Password1' }
 * Success response: Array of booking objects
 * Error response: { message: string }
 */
app.get('/api/admin/bookings', auth, async (req, res) => {
  try {
    // Ensure data directory and files exist before attempting to read
    await ensureDataDirExists();
    
    // Read the bookings data file
    const data = await fs.readFile(bookingsFile, 'utf8');
    
    // Parse the JSON string into an array of booking objects
    const bookings = JSON.parse(data);
    
    // Return the bookings array as JSON response
    res.json(bookings);
  } catch (error) {
    // Log any errors and return a 500 server error response
    console.error('Error reading bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

/**
 * Admin: Update Booking Status
 * PUT /api/admin/bookings/:id
 * 
 * Protected route that allows updating the status of a specific booking
 * Common status values: 'pending', 'confirmed', 'cancelled', 'completed'
 * 
 * URL parameters: id - The booking identifier
 * Request body: { status: string }
 * Headers required: { Authorization: 'Bearer Password1' }
 * Success response: { success: true, booking: Object, message: string }
 * Error responses: 
 *   - 404 Not Found: { message: 'Booking not found' }
 *   - 500 Server Error: { message: 'Error updating booking' }
 */
app.put('/api/admin/bookings/:id', auth, async (req, res) => {
  try {
    // Ensure data directory and files exist
    await ensureDataDirExists();
    
    // Extract booking ID from URL parameters
    const { id } = req.params;
    
    // Extract the new status from request body
    const { status } = req.body;
    
    // Read the current bookings data
    const data = await fs.readFile(bookingsFile, 'utf8');
    const bookings = JSON.parse(data);
    
    // Find the index of the booking with the specified ID
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    
    // If booking not found, return 404 error
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Update the booking status and add timestamp
    bookings[bookingIndex].status = status;
    bookings[bookingIndex].updatedAt = new Date().toISOString();
    
    // Write the updated bookings data back to the file
    // The null, 2 parameters add formatting to make the JSON file readable
    await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2));
    
    // Return success response with the updated booking data
    res.json({ 
      success: true, 
      booking: bookings[bookingIndex],
      message: 'Booking status updated successfully' 
    });
  } catch (error) {
    // Log any errors and return a 500 server error response
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
});

/**
 * Public: Get All Bookings (Consider removing in production)
 * GET /api/bookings
 * 
 * Returns all booking data - this is provided for development and testing
 * In a production environment, this would typically be removed or restricted
 * 
 * Success response: Array of booking objects
 * Error response: { message: string }
 */
app.get('/api/bookings', async (req, res) => {
  try {
    // Ensure data directory and files exist
    await ensureDataDirExists();
    
    // Read the bookings data file
    const data = await fs.readFile(bookingsFile, 'utf8');
    
    // Parse the JSON data into an array of booking objects
    const bookings = JSON.parse(data);
    
    // Return all bookings
    res.json(bookings);
  } catch (error) {
    // Log any errors and return a 500 server error response
    console.error('Error reading bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

/**
 * Create New Booking
 * POST /api/bookings
 * 
 * Public endpoint that allows guests to submit booking requests
 * Creates a new booking entry with a unique ID and timestamp
 * 
 * Request body: {
 *   fullName: string,
 *   email: string,
 *   phone: string,
 *   checkIn: string (YYYY-MM-DD),
 *   checkOut: string (YYYY-MM-DD),
 *   message: string (optional),
 *   totalPrice: number
 * }
 * Success response (201 Created): { message: string, booking: Object }
 * Error responses:
 *   - 400 Bad Request: { message: 'Required fields are missing' }
 *   - 500 Server Error: { message: 'Error saving booking request' }
 */
app.post('/api/bookings', async (req, res) => {
  try {
    // Ensure data directory and files exist
    await ensureDataDirExists();
    
    // Extract booking details from request body
    const {
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      message,
      totalPrice
    } = req.body;
    
    // Perform basic validation of required fields
    if (!fullName || !email || !phone || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    // Read existing bookings from the file
    const data = await fs.readFile(bookingsFile, 'utf8');
    const bookings = JSON.parse(data);
    
    // Create a new booking object with a unique ID (timestamp-based)
    const newBooking = {
      id: Date.now().toString(), // Simple unique ID approach for demo
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      message: message || '', // Use empty string if no message provided
      totalPrice,
      status: 'pending', // All new bookings start with pending status
      createdAt: new Date().toISOString() // Add creation timestamp
    };
    
    // Add the new booking to the bookings array
    bookings.push(newBooking);
    
    // Write the updated bookings array back to the file
    await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2));
    
    // Return success response with 201 Created status
    res.status(201).json({ 
      message: 'Booking request received successfully', 
      booking: newBooking 
    });
    
  } catch (error) {
    // Log any errors and return a 500 server error response
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error saving booking request' });
  }
});

/**
 * Get Booking by ID
 * GET /api/bookings/:id
 * 
 * Retrieves the details of a specific booking by its ID
 * 
 * URL parameters: id - The booking identifier
 * Success response: Booking object
 * Error responses:
 *   - 404 Not Found: { message: 'Booking not found' }
 *   - 500 Server Error: { message: 'Error retrieving booking' }
 */
app.get('/api/bookings/:id', async (req, res) => {
  try {
    // Ensure data directory and files exist
    await ensureDataDirExists();
    
    // Read the bookings data file
    const data = await fs.readFile(bookingsFile, 'utf8');
    const bookings = JSON.parse(data);
    
    // Find the booking with the matching ID
    const booking = bookings.find(b => b.id === req.params.id);
    
    // If no booking found with that ID, return 404 error
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Return the booking object
    res.json(booking);
  } catch (error) {
    // Log any errors and return a 500 server error response
    console.error('Error finding booking:', error);
    res.status(500).json({ message: 'Error retrieving booking' });
  }
});

/**
 * Start the Express server
 * 
 * Initializes the server and ensures the data directory exists
 * Logs a message when the server is successfully running
 */
app.listen(PORT, async () => {
  // Make sure data directory and files exist before starting
  await ensureDataDirExists();
  
  // Log successful server startup
  console.log(`Server running on port ${PORT}`);
});
