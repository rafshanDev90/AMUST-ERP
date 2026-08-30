const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: { type: String, unique: true, sparse: true },
  loginId: { type: String, unique: true, sparse: true },
  parentPhone: { type: String, unique: true, sparse: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "teacher", "student", "parent"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
