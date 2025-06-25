const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const { flightId, passengers } = req.body;

        // Check if flight exists and has available seats
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({
                success: false,
                error: 'Flight not found'
            });
        }

        if (flight.availableSeats < passengers.length) {
            return res.status(400).json({
                success: false,
                error: 'Not enough seats available'
            });
        }

        // Calculate total amount
        const totalAmount = flight.price * passengers.length;

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            flight: flightId,
            passengers,
            totalAmount
        });

        // Populate flight and user details
        await booking.populate('flight');
        await booking.populate('user', 'name email');

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('flight')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('flight')
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Make sure user owns booking or is admin
        if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Make sure user owns booking
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to cancel this booking'
            });
        }

        // Check if booking can be cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                error: 'Booking is already cancelled'
            });
        }

        // Update booking status
        booking.status = 'cancelled';
        await booking.save();

        // Return seats to flight
        const flight = await Flight.findById(booking.flight);
        if (flight) {
            flight.availableSeats += booking.passengers.length;
            await flight.save();
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('flight')
            .populate('user', 'name email')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, paymentStatus },
            {
                new: true,
                runValidators: true
            }
        ).populate('flight').populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
