const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,

  subject: String,
  class: String,
  section: String,

  // IMPORTANT: teacher user link
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Teacher", teacherSchema);
