const Message = require('../models/Message');
const Booking = require('../models/Booking');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, receiverId, message } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const newMessage = await Message.create({
      bookingId,
      senderId: req.user._id,
      receiverId,
      message
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name phone')
      .populate('receiverId', 'name phone');

    const io = req.app.get('io');
    io.to(receiverId.toString()).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a booking
exports.getMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const messages = await Message.find({ bookingId })
      .populate('senderId', 'name phone')
      .populate('receiverId', 'name phone')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await Message.updateMany(
      { 
        bookingId, 
        receiverId: req.user._id, 
        isRead: false 
      },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    // Emit socket event
    const io = req.app.get('io');
    const messages = await Message.find({ bookingId, receiverId: req.user._id });
    
    if (messages.length > 0) {
      const senderId = messages[0].senderId;
      io.to(senderId.toString()).emit('messagesRead', { bookingId, readBy: req.user._id });
    }

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: error.message });
  }
};
