const Flight = require('../models/Flight');

// @desc    Get all flights
// @route   GET /api/flights
// @access  Public
exports.getFlights = async (req, res) => {
    try {
        const flights = await Flight.find({ status: 'scheduled' });

        res.status(200).json({
            success: true,
            count: flights.length,
            data: flights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Search flights
// @route   GET /api/flights/search
// @access  Public
exports.searchFlights = async (req, res) => {
    try {
        const { origin, destination, departureDate } = req.query;

        if (!origin || !destination || !departureDate) {
            return res.status(400).json({
                success: false,
                error: 'Please provide origin, destination, and departure date'
            });
        }

        // Create date range for the departure date
        const startDate = new Date(departureDate);
        const endDate = new Date(departureDate);
        endDate.setDate(endDate.getDate() + 1);

        const flights = await Flight.find({
            origin: { $regex: origin, $options: 'i' },
            destination: { $regex: destination, $options: 'i' },
            departureTime: {
                $gte: startDate,
                $lt: endDate
            },
            status: 'scheduled',
            availableSeats: { $gt: 0 }
        }).sort({ departureTime: 1 });

        res.status(200).json({
            success: true,
            count: flights.length,
            data: flights
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
exports.getFlight = async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            return res.status(404).json({
                success: false,
                error: 'Flight not found'
            });
        }

        res.status(200).json({
            success: true,
            data: flight
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private/Admin
exports.createFlight = async (req, res) => {
    try {
        const flight = await Flight.create(req.body);

        res.status(201).json({
            success: true,
            data: flight
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private/Admin
exports.updateFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!flight) {
            return res.status(404).json({
                success: false,
                error: 'Flight not found'
            });
        }

        res.status(200).json({
            success: true,
            data: flight
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private/Admin
exports.deleteFlight = async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);

        if (!flight) {
            return res.status(404).json({
                success: false,
                error: 'Flight not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
