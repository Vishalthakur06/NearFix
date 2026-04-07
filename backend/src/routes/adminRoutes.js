const express = require('express');
const { getDashboard, getAllUsers, getAllWorkers, approveWorker, updateWorker, deleteWorker, getAllBookings } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), getDashboard);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/workers', protect, authorize('admin'), getAllWorkers);
router.put('/workers/:id/approve', protect, authorize('admin'), approveWorker);
router.put('/workers/:id', protect, authorize('admin'), updateWorker);
router.delete('/workers/:id', protect, authorize('admin'), deleteWorker);
router.get('/bookings', protect, authorize('admin'), getAllBookings);

module.exports = router;
