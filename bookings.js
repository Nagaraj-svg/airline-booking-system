const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBooking,
    cancelBooking,
    getAllBookings,
    updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// User routes
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBooking);
router.put('/:id/cancel', cancelBooking);

// Admin routes
router.get('/', authorize('admin'), getAllBookings);
router.put('/:id/status', authorize('admin'), updateBookingStatus);

module.exports = router;
