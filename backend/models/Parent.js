const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const parentSchema = new mongoose.Schema({
  parentId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },
  name: { type: String, required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  role: { type: String, enum: ['parent'], default: 'parent' } , // 👈 added role
  otp: String,
otpExpiry: Date,
resetToken: String,
resetTokenExpiry: Date


});


module.exports = mongoose.model('Parent', parentSchema);
