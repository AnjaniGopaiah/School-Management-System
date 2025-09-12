const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('students');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('students');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).populate('students');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    // Prepare student summaries
    const studentSummaries = teacher.students.map(student => {
      const totalDays = student.attendance.length;
      const presentDays = student.attendance.filter(a => a.present).length;

      return {
        name: student.name,
        class: student.class,
        marks: student.marks,
        attendanceSummary: {
          totalDays,
          presentDays
        }
      };
    });

    res.json({
      teacherId: teacher.teacherId,
      name: teacher.name,
      subject: teacher.subject,
      students: studentSummaries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard
};
