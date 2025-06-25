const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    passengers: [{
        name: {
            type: String,
            required: [true, 'Passenger name is required']
        },
        age: {
            type: Number,
            required: [true, 'Passenger age is required']
        },
        seatNumber: {
            type: String,
            required: [true, 'Seat number is required']
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for efficient querying
bookingSchema.index({ user: 1, flight: 1 });

// Pre-save middleware to update available seats
bookingSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const Flight = mongoose.model('Flight');
            const flight = await Flight.findById(this.flight);
            
            if (flight) {
                const seatsBooked = this.passengers.length;
                if (flight.availableSeats >= seatsBooked) {
                    flight.availableSeats -= seatsBooked;
                    await flight.save();
                } else {
                    throw new Error('Not enough seats available');
                }
            }
        } catch (error) {
            next(error);
        }
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
