const mongoose = require('mongoose');

// Student daily attendance ka record
const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, // kis student ki attendance
  date: { type: Date, required: true }, // attendance ka din
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' }, // P/A/L
  note: String // optional note
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
