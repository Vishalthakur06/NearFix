const mongoose = require('mongoose');
const User = require('./src/models/User');
const Worker = require('./src/models/Worker');
require('dotenv').config();

const updateWorker = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find Vikram
    const user = await User.findOne({ phone: '9876543210' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Update user location (Indore coordinates)
    user.location = { lat: 22.7196, lng: 75.8577 };
    await user.save();
    console.log('✅ Updated user location');

    // Find and update worker
    const worker = await Worker.findOne({ userId: user._id });
    if (!worker) {
      console.log('Worker not found');
      process.exit(1);
    }

    worker.skills = ['Electrician'];
    worker.isAvailable = true;
    worker.isApproved = true;
    await worker.save();
    console.log('✅ Updated worker status');

    console.log('\nWorker Details:');
    console.log(`Name: ${user.name}`);
    console.log(`Phone: ${user.phone}`);
    console.log(`Location: ${user.location.lat}, ${user.location.lng}`);
    console.log(`Skills: ${worker.skills.join(', ')}`);
    console.log(`Available: ${worker.isAvailable}`);
    console.log(`Approved: ${worker.isApproved}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateWorker();
