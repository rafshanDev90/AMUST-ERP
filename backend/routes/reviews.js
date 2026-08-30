const express = require("express");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

const router = express.Router();

// Student can submit review
router.post("/", auth("student"), async (req, res) => {
  const { teacherId, rating, comment } = req.body;
  await Review.create({ student: req.user.id, teacher: teacherId, rating, comment });
  res.json({ message: "Review posted" });
});

// Get teacher reviews + average
router.get("/:teacherId", auth(["teacher","admin"]), async (req, res) => {
  const reviews = await Review.find({ teacher: req.params.teacherId }).populate("student");
  const avg = reviews.reduce((a,b) => a + b.rating, 0) / (reviews.length || 1);
  res.json({ average: avg.toFixed(2), count: reviews.length, reviews });
});

module.exports = router;
