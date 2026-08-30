const express = require('express');
const Attendance = require('../models/Attendance');
const auth = require('../middleware/auth');

const router = express.Router();

// Add attendance (teacher + admin)
router.post("/", auth(["teacher", "admin"]), async (req, res) => {
  const { student, date, status } = req.body;

  const record = await Attendance.create({
    student,
    date,
    status, // present | absent
    markedBy: req.user.id
  });

  res.json(record);
});


// Get attendance list (filter optional by date & student)
router.get('/', auth(['admin', 'teacher']), async (req, res) => {
  try {
    const q = {};
    if (req.query.date) q.date = new Date(req.query.date); // filter by date
    if (req.query.student) q.student = req.query.student;  // filter by student

    const list = await Attendance
      .find(q)
      .populate('student') // student details include
      .sort({ date: -1 }); // latest first

    res.json(list);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
