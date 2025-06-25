const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Route files
const auth = require('./routes/auth');
const flights = require('./routes/flights');
const bookings = require('./routes/bookings');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/flights', flights);
app.use('/api/bookings', bookings);

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Airline Booking API is running',
        timestamp: new Date().toISOString()
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

module.exports = app;
