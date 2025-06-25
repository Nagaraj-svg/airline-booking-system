const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        console.log('Note: Make sure MongoDB is running or update MONGODB_URI in .env file');
        // Don't exit process, let server run without database for testing
        console.log('Server will continue running without database connection...');
    }
};

module.exports = connectDB;
