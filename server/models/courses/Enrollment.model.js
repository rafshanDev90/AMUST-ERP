import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  // 🔗 Student Reference
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // 🔗 Course Reference
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  
  // ERP Metrics
  academicYear: { 
    type: String, 
    required: true 
  }, // e.g., "2026-2027"
  semesterEnrolled: { 
    type: Number, 
    required: true 
  }, // e.g., 1, 2, 3
  
  status: { 
    type: String, 
    enum: ['active', 'completed', 'dropped'], 
    default: 'active' 
  },
  progress: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  }, // Percentage completion
  grade: { 
    type: String, 
    default: 'N/A' 
  } // e.g., 'A+', 'B', 'Pending'
  
}, { timestamps: true });

// Ensure a student can only enroll in the same exact course once per academic session
enrollmentSchema.index({ student: 1, course: 1, academicYear: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
