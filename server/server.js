require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendance');
const feeRoutes = require('./routes/fees');
const noticeRoutes = require('./routes/notices');
const teacherRoutes = require('./routes/teachers');
const markRoutes = require('./routes/marks');
const reviewRoutes = require('./routes/reviews');

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set in environment variables.");
  process.exit(1);
}

const app = express();

const CORS_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});
app.use('/api/auth/login', authLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: 'Internal server error' });
});

const MONGO_URL = process.env.MONGO_URL;
if (!MONGO_URL) {
  console.error("FATAL: MONGO_URL is not set in environment variables.");
  process.exit(1);
}

async function start() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
