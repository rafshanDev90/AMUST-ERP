const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },     // Notice heading
  message: { type: String, required: true },   // Notice body
  audience: {                                   // kis ke liye notice hai
    type: String,
    enum: ['all', 'teachers', 'students', 'parents'],
    default: 'all'
  },
  eventDate: { type: Date },                   // notice se related event date
  date: { type: Date, default: Date.now },     // notice date
  createdBy: { type: String }                  // admin ka naam save karne ke liye
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
