const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user;
    let Model;

    if (role === 'student') Model = Student;
    else if (role === 'teacher') Model = Teacher;
    else if (role === 'parent') Model = Parent;
    else if (role === 'admin') Model = Admin;
    else return res.status(400).json({ error: 'Invalid role specified' });

    user = await Model.findOne({ username });

    if (!user) {
      const roleModels = {
        student: Student,
        teacher: Teacher,
        parent: Parent,
        admin: Admin
      };

      delete roleModels[role];

      for (const [otherRole, OtherModel] of Object.entries(roleModels)) {
        const otherUser = await OtherModel.findOne({ username });
        if (otherUser) {
          return res.status(403).json({
            error: `This user belongs to the ${otherRole} role. Please log in using the ${otherRole} login.`,
          });
        }
      }

      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // ⚠️ Password check (plaintext for now)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login };
