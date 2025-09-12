const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Student = require('../models/Student');

// ✅ Admin Dashboard
router.get('/dashboard', protect, (req, res) => {
  res.json({
    msg: `Welcome Admin: ${req.admin.username}`,
    admin: req.admin,
  });
});

// ✅ Get All Students
router.get('/students', protect, async (req, res) => {
  try {
    const students = await Student.find();
    console.log("🎓 Students fetched:", students.length); // 👈 DEBUG
    res.json(students); // ✅ MUST return array
  } catch (err) {
    console.error("❌ Failed to fetch students:", err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// ✅ Create Student
router.post('/students', protect, async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const saved = await newStudent.save();
    console.log("✅ Student created:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Create student failed:", err);
    res.status(400).json({ error: 'Failed to create student', details: err.message });
  }
});

// ✅ Update Student
router.put('/students/:id', protect, async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    }
    console.log("✏️ Student updated:", updated._id);
    res.json(updated);
  } catch (err) {
    console.error("❌ Update student failed:", err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// ✅ Delete Student
router.delete('/students/:id', protect, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    console.log("🗑️ Student deleted:", deleted._id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete student failed:", err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;
