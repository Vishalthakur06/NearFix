const mongoose = require('mongoose');
const User = require('./src/models/User');
const Worker = require('./src/models/Worker');
const Booking = require('./src/models/Booking');
require('dotenv').config();

const createTestBooking = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Create test customer
    let customer = await User.findOne({ phone: '9999999999' });
    if (!customer) {
      customer = await User.create({
        name: 'Test Customer',
        phone: '9999999999',
        password: 'customer123',
        role: 'user',
        city: 'Indore',
        location: { lat: 22.7196, lng: 75.8577 }
      });
      console.log('✅ Created test customer');
    } else {
      console.log('✅ Test customer already exists');
    }

    // Find an Indore worker
    const worker = await Worker.findOne().populate('userId');
    if (!worker) {
      console.log('❌ No workers found');
      process.exit(1);
    }

    // Create a test booking
    const booking = await Booking.create({
      userId: customer._id,
      workerId: worker._id,
      service: worker.skills[0],
      location: { lat: 22.7196, lng: 75.8577, address: 'Test Address, Indore' },
      price: 500,
      status: 'pending'
    });

    console.log('\n✅ Test booking created successfully!\n');
    console.log('📋 BOOKING DETAILS:');
    console.log('='.repeat(60));
    console.log(`Customer: ${customer.name} (${customer.phone})`);
    console.log(`Worker: ${worker.userId.name} (${worker.userId.phone})`);
    console.log(`Service: ${booking.service}`);
    console.log(`Price: ₹${booking.price}`);
    console.log(`Status: ${booking.status}`);
    console.log('='.repeat(60));
    console.log('\n🔑 TEST CREDENTIALS:');
    console.log('Customer Phone: 9999999999');
    console.log('Customer Password: customer123');
    console.log(`\nWorker Phone: ${worker.userId.phone}`);
    console.log('Worker Password: worker123');
    console.log('\n✅ Login as worker to accept/reject the booking!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createTestBooking();
