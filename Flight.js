const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: [true, 'Flight number is required'],
        unique: true
    },
    airline: {
        type: String,
        required: [true, 'Airline name is required']
    },
    origin: {
        type: String,
        required: [true, 'Origin is required']
    },
    destination: {
        type: String,
        required: [true, 'Destination is required']
    },
    departureTime: {
        type: Date,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Arrival time is required']
    },
    duration: {
        type: String,
        required: [true, 'Flight duration is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Available seats is required'],
        min: [0, 'Available seats cannot be negative']
    },
    totalSeats: {
        type: Number,
        required: [true, 'Total seats is required'],
        min: [1, 'Total seats must be at least 1']
    },
    aircraft: {
        type: String,
        required: [true, 'Aircraft type is required']
    },
    status: {
        type: String,
        enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
        default: 'scheduled'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient searching
flightSchema.index({ origin: 1, destination: 1, departureTime: 1 });

module.exports = mongoose.model('Flight', flightSchema);
