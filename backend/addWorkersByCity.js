const mongoose = require('mongoose');
const User = require('./src/models/User');
const Worker = require('./src/models/Worker');
require('dotenv').config();

const workers = [
  // Indore Workers
  { name: 'Rajesh Kumar', phone: '9876543210', password: 'worker123', skills: ['Electrician'], city: 'Indore', location: { lat: 22.7196, lng: 75.8577 } },
  { name: 'Amit Sharma', phone: '9876543211', password: 'worker123', skills: ['Plumber'], city: 'Indore', location: { lat: 22.7240, lng: 75.8650 } },
  { name: 'Priya Singh', phone: '9876543212', password: 'worker123', skills: ['Cleaner'], city: 'Indore', location: { lat: 22.7150, lng: 75.8500 } },
  { name: 'Suresh Patel', phone: '9876543213', password: 'worker123', skills: ['Driver'], city: 'Indore', location: { lat: 22.7300, lng: 75.8700 } },
  { name: 'Ramesh Verma', phone: '9876543214', password: 'worker123', skills: ['Carpenter'], city: 'Indore', location: { lat: 22.7100, lng: 75.8450 } },
  
  // Mumbai Workers
  { name: 'Deepak Joshi', phone: '9876543215', password: 'worker123', skills: ['Painter'], city: 'Mumbai', location: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Vikram Yadav', phone: '9876543216', password: 'worker123', skills: ['Electrician', 'Plumber'], city: 'Mumbai', location: { lat: 19.0896, lng: 72.8656 } },
  { name: 'Sanjay Gupta', phone: '9876543217', password: 'worker123', skills: ['Carpenter'], city: 'Mumbai', location: { lat: 19.0728, lng: 72.8826 } },
  
  // Delhi Workers
  { name: 'Mohan Das', phone: '9876543218', password: 'worker123', skills: ['Cleaner'], city: 'Delhi', location: { lat: 28.7041, lng: 77.1025 } },
  { name: 'Anil Mehta', phone: '9876543219', password: 'worker123', skills: ['Driver'], city: 'Delhi', location: { lat: 28.6139, lng: 77.2090 } },
  { name: 'Ravi Kumar', phone: '9876543220', password: 'worker123', skills: ['Electrician'], city: 'Delhi', location: { lat: 28.6692, lng: 77.4538 } },
  
  // Bangalore Workers
  { name: 'Kiran Reddy', phone: '9876543221', password: 'worker123', skills: ['Plumber'], city: 'Bangalore', location: { lat: 12.9716, lng: 77.5946 } },
  { name: 'Lakshmi Iyer', phone: '9876543222', password: 'worker123', skills: ['Cleaner'], city: 'Bangalore', location: { lat: 12.9352, lng: 77.6245 } },
  
  // Pune Workers
  { name: 'Ganesh Patil', phone: '9876543223', password: 'worker123', skills: ['Carpenter'], city: 'Pune', location: { lat: 18.5204, lng: 73.8567 } },
  { name: 'Sneha Desai', phone: '9876543224', password: 'worker123', skills: ['Painter'], city: 'Pune', location: { lat: 18.5314, lng: 73.8446 } }
];

const addWorkersByCity = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete existing workers
    await User.deleteMany({ role: 'worker' });
    await Worker.deleteMany({});
    console.log('🗑️  Cleared existing workers\n');

    console.log('🔄 Adding workers by city...\n');

    for (const workerData of workers) {
      const user = await User.create({
        name: workerData.name,
        phone: workerData.phone,
        password: workerData.password,
        role: 'worker',
        city: workerData.city,
        location: workerData.location
      });

      await Worker.create({
        userId: user._id,
        skills: workerData.skills,
        isAvailable: true,
        isApproved: true,
        rating: (Math.random() * 1 + 4).toFixed(1),
        totalRatings: Math.floor(Math.random() * 50) + 10
      });

      console.log(`✅ ${workerData.name} - ${workerData.city} - ${workerData.skills.join(', ')}`);
    }

    console.log('\n🎉 All workers added successfully!\n');
    console.log('📋 WORKER CREDENTIALS BY CITY:');
    console.log('='.repeat(70));
    
    const cities = [...new Set(workers.map(w => w.city))];
    cities.forEach(city => {
      console.log(`\n🏙️  ${city.toUpperCase()}`);
      console.log('-'.repeat(70));
      workers.filter(w => w.city === city).forEach(w => {
        console.log(`   ${w.name} | ${w.phone} | ${w.skills.join(', ')}`);
      });
    });
    
    console.log('\n' + '='.repeat(70));
    console.log('🔑 Password for all workers: worker123');
    console.log('='.repeat(70));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

addWorkersByCity();
