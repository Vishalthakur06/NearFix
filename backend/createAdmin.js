require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ phone: '1111111111' });
    if (existingAdmin) {
      console.log('Deleting existing admin...');
      await User.deleteOne({ phone: '1111111111' });
    }

    const admin = await User.create({
      name: 'Admin',
      phone: '1111111111',
      password: 'admin123',
      role: 'admin',
      city: 'Delhi'
    });

    console.log('✅ Admin created successfully!');
    console.log('Phone: 1111111111');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
