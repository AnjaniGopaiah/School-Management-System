const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addAttendance,
  getStudentDashboard
} = require('../controllers/StudentController');

const Student = require('../models/Student');  // Needed for /me route
const { protect } = require('../middleware/authMiddleware');
// 🛡️ Return logged-in student's full data
router.get('/me', protect(['student']), async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate('parent', 'name username'); // 👈 populate only needed fields

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// 🛡️ Student dashboard — student only
router.get('/:id/dashboard', protect(['student']), getStudentDashboard);

// Student attendance update — could allow teacher or student
router.post('/:id/attendance', protect(['teacher', 'student']), addAttendance);

// Admin can manage students
router.post('/', protect(['admin']), createStudent);
router.get('/', protect(['admin']), getStudents);
router.get('/:id', protect(['admin']), getStudentById);
router.put('/:id', protect(['admin', 'teacher']), updateStudent);
router.delete('/:id', protect(['admin', 'teacher']), deleteStudent);



module.exports = router;
