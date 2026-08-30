const express = require("express");
const Mark = require("../models/Mark");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["teacher"]), async (req, res) => {
  const { studentId, subject, exam, marks } = req.body;

  const m = await Mark.create({
    student: studentId,
    subject,
    exam,
    marks,
    enteredBy: req.user.id
  });

  res.json(m);
});

module.exports = router;
