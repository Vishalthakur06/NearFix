const mongoose = require('mongoose');
const User = require('./src/models/User');
const Worker = require('./src/models/Worker');
require('dotenv').config();

const workers = [
  {
    name: 'Rajesh Kumar',
    phone: '9876543210',
    password: 'worker123',
    skills: ['Electrician'],
    location: { lat: 22.7196, lng: 75.8577 }
  },
  {
    name: 'Amit Sharma',
    phone: '9876543211',
    password: 'worker123',
    skills: ['Plumber'],
    location: { lat: 22.7240, lng: 75.8650 }
  },
  {
    name: 'Priya Singh',
    phone: '9876543212',
    password: 'worker123',
    skills: ['Cleaner'],
    location: { lat: 22.7150, lng: 75.8500 }
  },
  {
    name: 'Suresh Patel',
    phone: '9876543213',
    password: 'worker123',
    skills: ['Driver'],
    location: { lat: 22.7300, lng: 75.8700 }
  },
  {
    name: 'Ramesh Verma',
    phone: '9876543214',
    password: 'worker123',
    skills: ['Carpenter'],
    location: { lat: 22.7100, lng: 75.8450 }
  },
  {
    name: 'Deepak Joshi',
    phone: '9876543215',
    password: 'worker123',
    skills: ['Painter'],
    location: { lat: 22.7280, lng: 75.8620 }
  },
  {
    name: 'Vikram Yadav',
    phone: '9876543216',
    password: 'worker123',
    skills: ['Electrician', 'Plumber'],
    location: { lat: 22.7180, lng: 75.8550 }
  },
  {
    name: 'Sanjay Gupta',
    phone: '9876543217',
    password: 'worker123',
    skills: ['Carpenter', 'Painter'],
    location: { lat: 22.7220, lng: 75.8600 }
  },
  {
    name: 'Mohan Das',
    phone: '9876543218',
    password: 'worker123',
    skills: ['Cleaner'],
    location: { lat: 22.7160, lng: 75.8520 }
  },
  {
    name: 'Anil Mehta',
    phone: '9876543219',
    password: 'worker123',
    skills: ['Driver'],
    location: { lat: 22.7250, lng: 75.8680 }
  }
];

const addWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔄 Adding workers...\n');

    for (const workerData of workers) {
      // Check if user already exists
      const existingUser = await User.findOne({ phone: workerData.phone });
      
      if (existingUser) {
        console.log(`⚠️  Worker ${workerData.name} already exists (${workerData.phone})`);
        continue;
      }

      // Create user
      const user = await User.create({
        name: workerData.name,
        phone: workerData.phone,
        password: workerData.password,
        role: 'worker',
        location: workerData.location
      });

      // Create worker profile
      await Worker.create({
        userId: user._id,
        skills: workerData.skills,
        isAvailable: true,
        isApproved: true,
        rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
        totalRatings: Math.floor(Math.random() * 50) + 10 // Random reviews 10-60
      });

      console.log(`✅ Added: ${workerData.name} - ${workerData.skills.join(', ')} (${workerData.phone})`);
    }

    console.log('\n🎉 All workers added successfully!\n');
    console.log('📋 WORKER CREDENTIALS:');
    console.log('='.repeat(60));
    workers.forEach((w, i) => {
      console.log(`${i + 1}. ${w.name}`);
      console.log(`   Phone: ${w.phone}`);
      console.log(`   Password: ${w.password}`);
      console.log(`   Skills: ${w.skills.join(', ')}`);
      console.log('-'.repeat(60));
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addWorkers();
