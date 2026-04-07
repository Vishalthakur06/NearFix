const express = require('express');
const { getNearbyWorkers, searchWorkers, getWorkerProfile, updateAvailability, updateSkills, getWorkerBookings } = require('../controllers/workerController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/nearby', protect, getNearbyWorkers);
router.get('/search', protect, searchWorkers);
router.get('/profile', protect, authorize('worker'), getWorkerProfile);
router.put('/availability', protect, authorize('worker'), updateAvailability);
router.put('/skills', protect, authorize('worker'), updateSkills);
router.get('/bookings', protect, authorize('worker'), getWorkerBookings);

module.exports = router;
