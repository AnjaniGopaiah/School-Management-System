const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true }, // 👈 added email
  password: { type: String, required: true },
  name: { type: String, required: true },
  subjects: { type: [String], required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],

  timetable: {
    type: [String],
    default: []
  },

  payments: [
    {
      amount: Number,
      date: Date,
      status: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending'
      }
    }
  ],

  role: { type: String, enum: ['teacher'], default: 'teacher' },
  otp: String,
otpExpiry: Date,
resetToken: String,
resetTokenExpiry: Date


});

module.exports = mongoose.model('Teacher', teacherSchema);
