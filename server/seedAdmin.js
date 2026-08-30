require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URL = process.env.MONGO_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@school.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function seed() {
  if (!MONGO_URL) {
    console.error("FATAL: MONGO_URL is not set.");
    process.exit(1);
  }
  if (!ADMIN_PASSWORD) {
    console.error("FATAL: ADMIN_PASSWORD is not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log("DB connected");

    const exists = await User.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: hash,
      role: 'admin'
    });

    console.log("Admin created successfully");
    process.exit(0);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();
