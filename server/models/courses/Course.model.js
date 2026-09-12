import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: { 
    type: String, 
    default: 'https://university.edu' 
  },
  duration: { 
    type: String, 
    required: true 
  }, // e.g., "7h 41m"
  
  // Categorization
  courseType: { 
    type: String, 
    enum: ['Short Course', 'Full Semester', 'Specialization'], 
    default: 'Full Semester' 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  
  // Professional Flags
  isPopular: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },

  // 🔗 Relationships (References)
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to your User model
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category' // Links to your Category model
  }]
}, { timestamps: true });

// Text indexing to make the search bar work perfectly
courseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Course', courseSchema);
