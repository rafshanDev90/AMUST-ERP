const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subject: String,
  exam: String, // Midterm, Final
  marks: Number,
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Mark", markSchema);
