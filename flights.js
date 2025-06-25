const express = require('express');
const router = express.Router();
const {
    getFlights,
    searchFlights,
    getFlight,
    createFlight,
    updateFlight,
    deleteFlight
} = require('../controllers/flightController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getFlights);
router.get('/search', searchFlights);
router.get('/:id', getFlight);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createFlight);
router.put('/:id', protect, authorize('admin'), updateFlight);
router.delete('/:id', protect, authorize('admin'), deleteFlight);

module.exports = router;
