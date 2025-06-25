# Quick Start Guide - Airline Booking System

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

## Installation & Setup

1. **Navigate to project directory:**
   ```bash
   cd nagraj
   ```

2. **Dependencies are already installed** ✅
   (npm install was completed successfully)

3. **Environment Setup:**
   - The `.env` file is already configured with default settings
   - For production, update the following in `.env`:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_secure_jwt_secret
     ```

4. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/airline-booking`

5. **Seed the Database (Optional but Recommended):**
   ```bash
   npm run seed
   ```
   This will create:
   - Sample flights for testing
   - Admin user (email: admin@airline.com, password: admin123)

6. **Start the Server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # OR Production mode
   npm start
   ```

7. **Access the Application:**
   - Backend API: http://localhost:5000
   - Frontend: Open `frontend/public/index.html` in your browser
   - API Health Check: http://localhost:5000/api/health

## Testing the Application

### 1. Test API Endpoints (using curl or Postman):

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Search Flights:**
```bash
curl "http://localhost:5000/api/flights/search?origin=New York&destination=Los Angeles&departureDate=2024-02-15"
```

### 2. Test Frontend Interface:

1. Open `frontend/public/index.html` in your browser
2. Register a new account or login
3. Search for flights
4. Book a flight
5. View your bookings

## Project Structure

```
nagraj/
├── backend/                 # Backend API
│   ├── config/             # Database & app configuration
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Authentication middleware
│   ├── utils/              # Helper functions
│   ├── app.js              # Express app setup
│   ├── server.js           # Server startup
│   └── seedData.js         # Database seeder
├── frontend/               # Frontend interface
│   └── public/             # Static files
│       ├── index.html      # Main HTML file
│       ├── styles.css      # Styling
│       └── script.js       # JavaScript functionality
├── .env                    # Environment variables
├── package.json            # Dependencies & scripts
└── README.md              # Full documentation
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart
- `npm run seed` - Populate database with sample data

## Features Included

✅ User Authentication (Register/Login)
✅ Flight Search & Filtering
✅ Flight Booking System
✅ Booking Management
✅ Admin Panel Features
✅ Responsive Web Interface
✅ RESTful API
✅ MongoDB Integration
✅ JWT Authentication
✅ Password Hashing
✅ Error Handling
✅ Sample Data

## Default Admin Account
- Email: admin@airline.com
- Password: admin123

## Troubleshooting

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Port Already in Use:**
   - Change PORT in .env file
   - Kill process using the port

3. **CORS Issues:**
   - Update CLIENT_URL in .env file
   - Check frontend API_URL in script.js

## Next Steps

1. Add payment integration
2. Implement email notifications
3. Add flight status updates
4. Create mobile app
5. Add more advanced search filters
6. Implement seat selection interface

## Support

For issues or questions, refer to the main README.md file or check the code comments.
