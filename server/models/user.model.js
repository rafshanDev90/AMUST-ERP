import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

clerkId:{ type: String, required: true, unique: true }, // Clerk's user_xxx
email:{ type: String, required: true, unique: true },

name:{ type: String },
role:{ type: String, enum: ['student', 'teacher', 'admin'], default:
'student' },

studentId:{ type: String },
faculty:{ type: String },

}, { timestamps: true });
export default mongoose.model('User', userSchema);