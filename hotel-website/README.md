# Alpine Athletics Resort Website

A modern hotel website built with React.js and Node.js, focusing on athletic and outdoor activities. The site features a responsive design, room booking functionality, and a complete UI showcasing the hotel's amenities.

## Features

- **Modern UI**: Built with React and TailwindCSS for a responsive, beautiful interface
- **Athletic Focus**: Highlights fitness facilities and outdoor activities
- **Room Booking**: Form to request bookings with date selection and price calculation
- **Room Showcase**: Display of different room types with features and images
- **Image Gallery**: Curated gallery of hotel facilities and activities
- **Backend API**: Node.js/Express server to handle booking requests

## Tech Stack

### Frontend
- React.js
- TailwindCSS for styling
- Axios for API requests
- Responsive design for all devices

### Backend
- Node.js
- Express.js
- File-based JSON storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hotel-website
```

2. Install dependencies for both frontend and backend
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### Running the Application

1. Start the backend server
```bash
# From the server directory
npm run dev
```

2. In a new terminal, start the frontend development server
```bash
# From the client directory
npm run dev
```

3. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Project Structure

```
hotel-website/
├── client/               # React frontend
│   ├── public/           # Static files
│   │   └── images/       # Hotel images
│   └── src/              # React source code
│       ├── components/   # UI components
│       │   ├── Navbar.jsx
│       │   ├── Hero.jsx
│       │   ├── Features.jsx
│       │   ├── Rooms.jsx
│       │   ├── BookingForm.jsx
│       │   ├── Testimonials.jsx
│       │   ├── Gallery.jsx
│       │   └── Footer.jsx
│       ├── App.jsx       # Main App component
│       ├── App.css       # App-specific styles
│       ├── index.css     # Global styles with TailwindCSS
│       └── main.jsx      # Entry point
├── server/               # Node.js backend
│   ├── data/             # Data storage directory
│   │   └── bookings.json # Booking data
│   ├── index.js          # Express server
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/bookings`: Get all bookings
- `POST /api/bookings`: Create a new booking
- `GET /api/bookings/:id`: Get a specific booking by ID

## Room Booking Details

All rooms are priced at $350 per night. The booking form collects:
- Full name
- Email address
- Phone number
- Check-in date
- Check-out date
- Special requests (optional)

The backend calculates the total price based on the number of nights.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
