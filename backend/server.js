const User = require("./models/User");
const bcrypt = require("bcryptjs");

// .env file ke variables load karne ke liye
require('dotenv').config();

// Express backend server banane ke liye
const express = require('express');

// MongoDB se connect karne ke liye
const mongoose = require('mongoose');

// Backend API ko frontend se connect karne ke liye (Cross-Origin)
const cors = require('cors');

// Sabhi routes import kar rahe hain
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fees');
const noticeRoutes = require('./routes/notices');

const app = express();

// CORS enable (taaki frontend backend se communicate kar sake)
app.use(cors());

// Backend ko JSON data receive karne ke layak bana rahe hain
app.use(express.json());

// API routes register kar rahe hain (prefix /api rakha gaya)
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use("/api/teachers", require("./routes/teachers"));


// Local MongoDB ka URL (data isi database me save hoga)
const MONGO_URL = "mongodb://127.0.0.1:27017/schoolerp";

// MongoDB connect karne wala function
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Connected to DB ✔️");
  })
  .catch((err) => {
    console.log("Database connection error ❌", err);
  });

// Express server ko port 8080 par run kar rahe hain
app.listen(8080, () => {
  console.log("Server is listening at http://localhost:8080");
});


async function createDefaultAdmin() {
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "School Principal",
      email: "admin@school.com",
      password: hashed,
      role: "admin"
    });
    console.log("✔ Default Admin Created");
    console.log("   Email: admin@school.com");
    console.log("   Password: admin123");
  }
}

createDefaultAdmin();