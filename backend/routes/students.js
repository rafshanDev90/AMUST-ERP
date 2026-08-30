// ================================
// STUDENT ROUTES (FULL FIXED VERSION)
// ================================

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");

const Student = require("../models/Student");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Notice = require("../models/Notice");
const auth = require("../middleware/auth");

const router = express.Router();

// ======================================
// Helper: create enrollment number
// e.g. Imran + 12 → imran12
// ======================================
function makeEnrollment(name, roll) {
  return name.trim().toLowerCase().replace(/\s+/g, "") + roll;
}

// ======================================
// ADD STUDENT (FINAL FIXED VERSION)  
// ======================================
router.post("/", auth(["admin"]), async (req, res) => {
  try {
    console.log("Incoming student body:", req.body);

    const {
      name, dob, gender,
      class: className,
      section,
      address,
      rollNumber,
      loginId,
      studentPassword,
      parentName,
      parentPhone,
      parentPassword
    } = req.body;

    // ✅ BASIC VALIDATION
    if (!name || !className || !section || !rollNumber) {
      return res.status(400).json({ message: "Missing required student fields" });
    }

    // ✅ DUPLICATE CHECKS
    if (await User.findOne({ loginId })) {
      return res.status(400).json({ message: "Student loginId already exists" });
    }

    if (await User.findOne({ parentPhone })) {
      return res.status(400).json({ message: "Parent phone already exists" });
    }

    // ✅ CREATE STUDENT
    const student = new Student({
      name, dob, gender,
      class: className,
      section,
      address,
      rollNumber
    });

    // ✅ CREATE STUDENT USER
    const studentUser = await User.create({
      name,
      loginId,
      password: await bcrypt.hash(studentPassword, 10),
      role: "student"
    });
    student.user = studentUser._id;

    // ✅ CREATE PARENT USER
    const parentUser = await User.create({
      name: parentName,
      parentPhone,
      password: await bcrypt.hash(parentPassword, 10),
      role: "parent"
    });
    student.parentUser = parentUser._id;

    await student.save();

    console.log("✅ Student created:", student._id);

    res.json({
      message: "Student added successfully",
      student,
      credentials: {
        loginId,
        studentPassword,
        parentPhone,
        parentPassword
      }
    });

  } catch (err) {
    console.error("❌ Error creating student:", err);
    res.status(500).json({
      message: "Failed to add student",
      error: err.message
    });
  }
});


// ======================================
// GET ALL STUDENTS
// ======================================
router.get("/", auth(["admin", "teacher"]), async (req, res) => {
  try {
    const list = await Student.find().sort({
      class: 1,
      section: 1,
      rollNumber: 1,
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// GET STUDENTS BY CLASS
// ======================================
router.get(
  "/class/:className",
  auth(["admin", "teacher"]),
  async (req, res) => {
    try {
      const list = await Student.find({ class: req.params.className }).sort({
        rollNumber: 1,
      });
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ======================================
// GET BASIC STUDENT INFO
// ======================================
router.get("/:id", auth(["admin", "teacher", "parent"]), async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// FULL PROFILE (student + attendance + fees + notices)
// ======================================
router.get("/:id/profile", auth(), async (req, res) => {
  try {
    const user = req.user;
    const student = await Student.findById(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    // STUDENT CAN SEE ONLY OWN PROFILE
    if (user.role === "student" && student.user.toString() !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // PARENT CAN SEE ONLY HIS CHILD
    if (user.role === "parent" && student.parentUser?.toString() !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendance = await Attendance.find({ student: student._id }).sort({
      date: -1,
    });
    const fees = await Fee.find({ student: student._id }).sort({
      createdAt: -1,
    });

    const notices = await Notice.find({
      $or: [
        { audience: "all" },
        { audience: "students" },
        { audience: "parents" },
      ],
    }).sort({ createdAt: -1 });

    res.json({ student, attendance, fees, notices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// UPDATE STUDENT (ADMIN ONLY)
// ======================================
router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// DELETE STUDENT (ADMIN ONLY)
// ======================================
router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================================
// PDF TOKEN HELPER
// ======================================
function authPDF(req, res, next) {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token && req.query.token) token = req.query.token;

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ======================================
// PDF REPORT DOWNLOAD
// ======================================
router.get("/:id/report", authPDF, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const attendance = await Attendance.find({ student: student._id });
    const fees = await Fee.find({ student: student._id });

    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === "present").length;
    const absentDays = totalDays - presentDays;

    const attendancePercent = totalDays
      ? Math.round((presentDays * 100) / totalDays)
      : 0;

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${student.enrollmentNumber}_report.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Student Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Name: ${student.name}`);
    doc.text(`Class: ${student.class} - Section: ${student.section}`);
    doc.text(`Roll No: ${student.rollNumber}`);
    doc.moveDown();

    doc.fontSize(14).text("Attendance Summary:");
    doc.fontSize(12).text(`Total Days: ${totalDays}`);
    doc.text(`Present: ${presentDays}`);
    doc.text(`Absent: ${absentDays}`);
    doc.text(`Attendance %: ${attendancePercent}%`);
    doc.moveDown();

    doc.fontSize(14).text("Fee Summary:");
    const totalFee = fees.reduce((sum, f) => sum + f.amount, 0);
    const paidFee = fees
      .filter((f) => f.paid)
      .reduce((sum, f) => sum + f.amount, 0);
    const pendingFee = totalFee - paidFee;

    doc.fontSize(12).text(`Total Fee: ₹${totalFee}`);
    doc.text(`Paid: ₹${paidFee}`);
    doc.text(`Pending: ₹${pendingFee}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
