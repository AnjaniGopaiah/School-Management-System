const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { login } = require('../controllers/authController');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Admin = require('../models/Admin');


// Gmail nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔄 Helper: Get user and role by email
async function getUserByEmail(email) {
  let user = await Student.findOne({ email });
  if (user) return { user, role: 'student' };

  user = await Teacher.findOne({ email });
  if (user) return { user, role: 'teacher' };

  user = await Parent.findOne({ email });
  if (user) return { user, role: 'parent' };

  user = await Admin.findOne({ email });
  if (user) return { user, role: 'admin' };

  return { user: null, role: null };
}

// 🔐 Login
router.post('/login', login);

// 🌐 Ping
router.get('/ping', (req, res) => res.send('Auth route loaded'));

// 🔑 Request OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  const { user, role } = await getUserByEmail(email);

  if (!user) return res.status(404).json({ msg: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 mins
  await user.save();

  const mailData = {
    from: `MERN Schooling <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'OTP for Password Reset - MERN Schooling',
    html: `
      <p>Hello ${user.name || 'User'},</p>
      <p>You requested to reset your password for your <strong>${role}</strong> account.</p>
      <p>Your OTP is <strong>${otp}</strong>. It is valid for 5 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailData);
    res.json({ msg: 'OTP sent to your email', role });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ msg: 'Failed to send OTP email' });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const { user, role } = await getUserByEmail(email);

  if (!user) return res.status(404).json({ msg: 'User not found' });

  if (user.otp !== otp || Date.now() > user.otpExpiry) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ msg: 'OTP verified', token, role });
});

// 🔄 Reset Password
router.post('/reset-password/:role/:token', async (req, res) => {
  const { role, token } = req.params;
  const { password } = req.body;

 let Model =
  role === 'student' ? Student :
  role === 'teacher' ? Teacher :
  role === 'parent' ? Parent :
  role === 'admin' ? Admin :
  null;


  if (!Model) return res.status(400).json({ msg: 'Invalid role' });

  const user = await Model.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ msg: 'Token invalid or expired' });

  user.password = password; // Store plain text for development/testing only
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ msg: 'Password reset successful' });
});

module.exports = router;
