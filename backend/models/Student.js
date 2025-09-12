const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true }, // 👈 Added roll number
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },  // 👈 Email added earlier
  password: { type: String, required: true },
  name: { type: String, required: true },
  class: { type: String },

  marks: [{ subject: String, score: Number }],
  attendanceSummary: {
    presentDays: Number,
    totalDays: Number
  },

  timetable: {
    type: [String], // Later you can structure this as per your format
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

  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  role: { type: String, enum: ['student'], default: 'student' },
  otp: String,
otpExpiry: Date,
resetToken: String,
resetTokenExpiry: Date


});

module.exports = mongoose.model('Student', studentSchema);
