const express = require('express');
const router = express.Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard
} = require('../controllers/TeacherController');

const Teacher = require('../models/Teacher'); // ✅ Add this!
const { protect } = require('../middleware/authMiddleware');

// 🛡️ Authenticated teacher profile
router.get('/me', protect(['teacher']), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).populate('students');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
const Student = require('../models/Student'); // ✅ You forgot this too

router.put('/update-marks/:studentId', protect(['teacher']), async (req, res) => {
  const { studentId } = req.params;
  const { marks } = req.body;

  //console.log('➡️ Updating marks for:', studentId, marks);

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    student.marks = marks;
    await student.save();

    //console.log('✅ Marks saved:', student.marks);
    res.json({ msg: 'Marks updated successfully', student });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

router.put('/update-attendance/:studentId', protect(['teacher']), async (req, res) => {
  const { studentId } = req.params;
  let { presentDays, totalDays } = req.body;

  // 🔄 Convert to numbers if they come as strings
  presentDays = Number(presentDays);
  totalDays = Number(totalDays);

  // ✅ Now validate as numbers
  if (
    isNaN(presentDays) || presentDays < 0 ||
    isNaN(totalDays) || totalDays < 0 ||
    presentDays > totalDays
  ) {
    return res.status(400).json({ msg: 'Invalid attendance values' });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        attendanceSummary: { presentDays, totalDays }
      },
      { new: true }
    );

    if (!student) return res.status(404).json({ msg: 'Student not found' });

    res.json({ msg: 'Attendance updated successfully', student });
  } catch (err) {
    console.error('❌ Attendance update error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// 🛡️ Teacher dashboard (by ID)
router.get('/:id/dashboard', protect(['teacher']), getTeacherDashboard);

// 🛡️ Admin-only routes
router.post('/', protect(['admin']), createTeacher);
router.get('/', protect(['admin']), getTeachers);
router.get('/:id', protect(['admin']), getTeacherById);
router.put('/:id', protect(['admin']), updateTeacher);
router.delete('/:id', protect(['admin']), deleteTeacher);

module.exports = router;
