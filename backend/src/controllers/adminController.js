const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalWorkers = await Worker.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingApprovals = await Worker.countDocuments({ isApproved: false });

    res.json({ totalUsers, totalWorkers, totalBookings, pendingApprovals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate('userId');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { skills, isAvailable } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { skills, isAvailable },
      { new: true }
    ).populate('userId');
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    await Booking.deleteMany({ workerId: worker._id });
    await User.findByIdAndDelete(worker.userId);
    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId')
      .populate({ path: 'workerId', populate: { path: 'userId' } });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
