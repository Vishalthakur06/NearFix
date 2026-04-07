const express = require('express');
const { createBooking, getBookings, updateBookingStatus, rateBooking, cancelBooking, rescheduleBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/rate', protect, rateBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/reschedule', protect, rescheduleBooking);

module.exports = router;
