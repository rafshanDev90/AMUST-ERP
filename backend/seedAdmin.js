const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Local DB — jahan student/attendance data store ho raha hai
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function seed() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected");

    // Check if admin exists
    const exists = await User.findOne({ email: 'admin@school.com' });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Create admin user with encrypted password
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@school.com',
      password: hash,
      role: 'admin'
    });

    console.log("Admin created successfully");
    process.exit(0);

  } catch (err) {
    console.log("Error:", err);
    process.exit(1);
  }
}

seed();
