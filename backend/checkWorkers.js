const mongoose = require('mongoose');
const Worker = require('./src/models/Worker');
require('dotenv').config();

const checkWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const workers = await Worker.find().populate('userId');
    console.log(`Total Workers: ${workers.length}\n`);

    workers.forEach((worker, index) => {
      console.log(`Worker ${index + 1}:`);
      console.log(`  Name: ${worker.userId?.name}`);
      console.log(`  Phone: ${worker.userId?.phone}`);
      console.log(`  Skills: ${worker.skills.join(', ')}`);
      console.log(`  Available: ${worker.isAvailable}`);
      console.log(`  Approved: ${worker.isApproved}`);
      console.log(`  Rating: ${worker.rating}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkWorkers();
