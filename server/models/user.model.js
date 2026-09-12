import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

clerkId:{ type: String, required: true, unique: true }, // Clerk's user_xxx
email:{ type: String, required: true, unique: true },

name:{ type: String },
avatarUrl:{ type: String },

role:{ 
    type: String, 
    enum: ['student', 'teacher', 'admin'], 
    default:'student' },

studentId:{ type: String , unique: true, sparse: true }, // Student's user_xxx

currentSemester:{
    type:Number,
    default: 1
},

faculty:{ type: String },
department:{ type: String },

//Teacher specefic fields
title:{
    type:String
},
bio:{ type:String },

}, { timestamps: true });
export default mongoose.model('User', userSchema);