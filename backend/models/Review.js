const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  rating: Number, // 1 to 5
  comment: String,
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
