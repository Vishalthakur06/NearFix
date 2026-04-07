const mongoose = require('mongoose');
const User = require('./src/models/User');
const Worker = require('./src/models/Worker');
require('dotenv').config();

const fixWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with role 'worker'
    const workerUsers = await User.find({ role: 'worker' });
    console.log(`Found ${workerUsers.length} worker users`);

    for (const user of workerUsers) {
      // Check if Worker document exists
      const existingWorker = await Worker.findOne({ userId: user._id });
      
      if (!existingWorker) {
        // Create Worker document
        await Worker.create({
          userId: user._id,
          skills: ['Electrician'], // Default skill, you can change this
          isAvailable: false,
          isApproved: false
        });
        console.log(`Created Worker document for user: ${user.name}`);
      } else {
        console.log(`Worker document already exists for: ${user.name}`);
      }
    }

    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixWorkers();
