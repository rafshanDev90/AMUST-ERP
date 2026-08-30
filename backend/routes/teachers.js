// backend/routes/teachers.js

const express = require("express");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * CREATE TEACHER  (Admin Only)
 */
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    console.log("Incoming Teacher Body:", req.body);

    const { name, email, phone, subject, class: className, section, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // 1. Create USER
    const hashed = await bcrypt.hash(password, 10);
    const teacherUser = await User.create({
      name,
      email,
      password: hashed,
      role: "teacher",
    });

    // 2. Create TEACHER PROFILE + LINK USER
    const teacher = await Teacher.create({
      name,
      email,
      phone,
      subject,
      class: className,
      section,
      user: teacherUser._id,
    });

    return res.json({
      message: "Teacher created successfully",
      teacher,
      credentials: { email, password },
    });

  } catch (err) {
    console.error("Error in POST /teachers:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET ALL TEACHERS (Admin Only)
 */
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const list = await Teacher.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET LOGGED-IN TEACHER PROFILE
 */
router.get("/me/profile", auth(["teacher"]), async (req, res) => {
  try {
    console.log("Teacher user id:", req.user.id);

    const teacher = await Teacher.findOne({ user: req.user.id });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    res.json(teacher);
  } 
  catch (err) {
    console.error("Error loading teacher profile:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
