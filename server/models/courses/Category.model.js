import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  description: { 
    type: String 
  }
}, { timestamps: true });

// Indexing slug for lightning-fast frontend searches
categorySchema.index({ slug: 1 });

export default mongoose.model('Category', categorySchema);
