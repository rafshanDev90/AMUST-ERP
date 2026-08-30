const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { loginId, rollNumber, email, parentPhone, password } = req.body;

    let user = null;

    if (parentPhone) {
      user = await User.findOne({ parentPhone, role: "parent" });
    } else if (loginId) {
      user = await User.findOne({ loginId, role: "student" });
    } else if (rollNumber) {
      user = await User.findOne({ rollNumber, role: "student" });
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) return res.status(400).json({ message: "Invalid login details" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let studentId = null;
    try {
      if (user.role === "student") {
        const s = await Student.findOne({ user: user._id });
        if (s) studentId = s._id.toString();
      } else if (user.role === "parent") {
        const s = await Student.findOne({ parentUser: user._id });
        if (s) studentId = s._id.toString();
      }
    } catch (e) {
      console.error("Warning: unable to find student link:", e.message);
    }

    return res.json({
      token,
      user: {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email || null,
        loginId: user.loginId || null,
        rollNumber: user.rollNumber || null,
        parentPhone: user.parentPhone || null,
        studentId,
      }
    });

  } catch (err) {
    console.error("Error in /auth/login:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
