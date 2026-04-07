const express = require('express');
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, updateLocation } = require('../controllers/userController');
const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/location', protect, updateLocation);

module.exports = router;
