const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  gender: String,

  class: String,
  section: String,

  rollNumber: { type: String, required: true }, // ✅ keep this

  // ❌ REMOVE enrollmentNumber completely

  parentName: String,
  parentPhone: String,
  address: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  parentUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
