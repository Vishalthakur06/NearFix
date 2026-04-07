const Worker = require('../models/Worker');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.searchWorkers = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json([]);
    const workers = await Worker.find({})
      .populate({ path: 'userId', match: { name: { $regex: name, $options: 'i' } } });
    res.json(workers.filter(w => w.userId));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNearbyWorkers = async (req, res) => {
  try {
    const { service, city } = req.query;

    const workers = await Worker.find({
      skills: { $in: [new RegExp(`^${service}$`, 'i')] },
      isAvailable: true
    }).populate('userId');

    const filtered = (city && city !== 'undefined' && city !== 'null')
      ? workers.filter(w => w.userId?.city?.toLowerCase() === city.toLowerCase())
      : workers;

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id }).populate('userId');
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      { isAvailable },
      { new: true }
    );
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      { skills },
      { new: true }
    );
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWorkerBookings = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }
    const bookings = await Booking.find({ workerId: worker._id })
      .populate('userId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
