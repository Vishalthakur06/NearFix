const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const chatController = require('../controllers/chatController');

router.post('/send', protect, chatController.sendMessage);
router.get('/booking/:bookingId', protect, chatController.getMessages);
router.put('/read/:bookingId', protect, chatController.markAsRead);
router.get('/unread-count', protect, chatController.getUnreadCount);

module.exports = router;
