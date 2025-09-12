const Parent = require('../models/Parent');
const Student = require('../models/Student');

const createParent = async (req, res) => {
  try {
    const parent = new Parent(req.body);
    await parent.save();
    res.status(201).json(parent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getParents = async (req, res) => {
  try {
    const parents = await Parent.find().populate('student');
    res.json(parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getParentById = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).populate('student');
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json(parent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteParent = async (req, res) => {
  try {
    const parent = await Parent.findByIdAndDelete(req.params.id);
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json({ message: 'Parent deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getParentDashboard = async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id);
    if (!parent) return res.status(404).json({ error: 'Parent not found' });

    const student = await Student.findOne({ parentUsername: parent.username });
    if (!student) return res.status(404).json({ error: 'Student not found for this parent' });

    const totalDays = student.attendance.length;
    const presentDays = student.attendance.filter(a => a.present).length;

    res.json({
      parentName: parent.name,
      student: {
        name: student.name,
        class: student.class,
        marks: student.marks,
        attendanceSummary: {
          totalDays,
          presentDays
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
  getParentDashboard
};
