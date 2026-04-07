const User = require('../models/User');
const Worker = require('../models/Worker');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

exports.register = async (req, res) => {
  try {
    const { name, phone, password, role, skills, location, city } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, phone, password, role, location, city });

    if (role === 'worker') {
      await Worker.create({ userId: user._id, skills: skills || [] });
    }

    const token = generateToken(user._id);
    res.status(201).json({ token, user: { _id: user._id, name, phone, role, city } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Auto-create Worker document if missing
    if (user.role === 'worker') {
      const existing = await Worker.findOne({ userId: user._id });
      if (!existing) {
        await Worker.create({ userId: user._id, skills: [], isAvailable: false, isApproved: false });
      }
    }

    const token = generateToken(user._id);
    res.json({ token, user: { _id: user._id, name: user.name, phone, role: user.role, city: user.city } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
