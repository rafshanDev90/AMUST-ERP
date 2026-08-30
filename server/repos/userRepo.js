const User = require("../models/User");

async function findByLoginId(loginId) {
  return await User.findOne({ loginId });
}

async function findByParentPhone(parentPhone) {
  return await User.findOne({ parentPhone });
}

async function findByEmail(email) {
  return await User.findOne({ email });
}

async function findById(id) {
  return await User.findById(id);
}

async function comparePassword(candidatePassword, storedPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(candidatePassword, storedPassword);
}

async function createUser(userData) {
  return await User.create(userData);
}

async function findByIdAndUpdate(id, updateData) {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
}

async function findByIdAndDelete(id) {
  return await User.findByIdAndDelete(id);
}

module.exports = {
  findByLoginId,
  findByParentPhone,
  findByEmail,
  findById,
  comparePassword,
  createUser,
  findByIdAndUpdate,
  findByIdAndDelete,
};