const Student = require('../models/Student');

// Create student + compute attendance summary if attendance is given
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);

    // Initialize attendanceSummary
    const attendance = req.body.attendance || [];
    student.attendanceSummary = {
      totalDays: attendance.length,
      presentDays: attendance.filter(a => a.present).length
    };

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add attendance for a student + update summary
const addAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { date, present } = req.body;

    student.attendance.push({ date, present });
    student.attendanceSummary.totalDays += 1;
    if (present) student.attendanceSummary.presentDays += 1;

    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.present).length;

    res.json({
      name: student.name,
      class: student.class,
      marks: student.marks,
      attendanceSummary: {
        totalDays,
        presentDays
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  addAttendance,
  getStudentDashboard
};
