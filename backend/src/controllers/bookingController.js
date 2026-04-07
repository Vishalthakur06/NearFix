const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.createBooking = async (req, res) => {
  try {
    const { workerId, service, location, price } = req.body;
    
    const booking = await Booking.create({
      userId: req.user._id,
      workerId,
      service,
      location,
      price
    });

    const worker = await Worker.findById(workerId).populate('userId');
    
    // Create notification for worker
    await createNotification(
      worker.userId._id,
      'New Booking Request',
      `You have a new booking request for ${service}`,
      'booking',
      booking._id
    );

    const io = req.app.get('io');
    io.to(worker.userId._id.toString()).emit('newBooking', booking);
    io.to(worker.userId._id.toString()).emit('notification', {
      title: 'New Booking Request',
      message: `You have a new booking request for ${service}`,
      type: 'booking'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ userId: req.user._id });
      bookings = worker
        ? await Booking.find({ workerId: worker._id })
            .populate('userId')
            .populate({ path: 'workerId', populate: { path: 'userId' } })
        : [];
    } else {
      bookings = await Booking.find({ userId: req.user._id })
        .populate('userId')
        .populate({ path: 'workerId', populate: { path: 'userId' } });
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'completed' && { completedAt: Date.now() }) },
      { new: true }
    ).populate('userId').populate({ path: 'workerId', populate: { path: 'userId' } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update worker earnings if completed
    if (status === 'completed') {
      const worker = await Worker.findById(booking.workerId._id);
      worker.earnings += booking.price;
      await worker.save();
    }

    // Create notification for customer
    const statusMessages = {
      accepted: 'Your booking has been accepted',
      completed: 'Your booking has been completed',
      rejected: 'Your booking has been rejected'
    };

    if (statusMessages[status]) {
      await createNotification(
        booking.userId._id,
        'Booking Update',
        statusMessages[status],
        'booking',
        booking._id
      );
    }

    const io = req.app.get('io');
    io.to(booking.userId._id.toString()).emit('bookingUpdate', booking);
    io.to(booking.userId._id.toString()).emit('notification', {
      title: 'Booking Update',
      message: statusMessages[status] || 'Your booking status has been updated',
      type: 'booking'
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rateBooking = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { rating, review },
      { new: true }
    ).populate({ path: 'workerId', populate: { path: 'userId' } });

    const worker = await Worker.findById(booking.workerId._id);
    worker.totalRatings += 1;
    worker.rating = ((worker.rating * (worker.totalRatings - 1)) + rating) / worker.totalRatings;
    await worker.save();

    // Notify worker about rating
    await createNotification(
      booking.workerId.userId._id,
      'New Rating Received',
      `You received a ${rating}-star rating`,
      'rating',
      booking._id
    );

    const io = req.app.get('io');
    io.to(booking.workerId.userId._id.toString()).emit('notification', {
      title: 'New Rating Received',
      message: `You received a ${rating}-star rating`,
      type: 'rating'
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate({ path: 'workerId', populate: { path: 'userId' } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason;
    await booking.save();

    const io = req.app.get('io');
    if (booking.workerId && booking.workerId.userId) {
      io.to(booking.workerId.userId._id.toString()).emit('bookingCancelled', booking);
    }

    res.json(booking);
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.rescheduleBooking = async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('userId')
      .populate({ path: 'workerId', populate: { path: 'userId' } });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot reschedule this booking' });
    }

    booking.scheduledDate = new Date(scheduledDate);
    booking.status = 'rescheduled';
    await booking.save();

    const io = req.app.get('io');
    if (booking.workerId && booking.workerId.userId) {
      io.to(booking.workerId.userId._id.toString()).emit('bookingRescheduled', booking);
    }

    res.json(booking);
  } catch (error) {
    console.error('Reschedule error:', error);
    res.status(500).json({ message: error.message });
  }
};
