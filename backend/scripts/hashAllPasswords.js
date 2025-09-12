const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

// Load env variables
dotenv.config();

// Import your models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Parent = require('../models/Parent');

// Mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => {
    console.error('❌ DB connection failed:', err);
    process.exit(1);
  });

const hashPasswords = async () => {
  try {
    // Hash student passwords
    const students = await Student.find();
    for (const student of students) {
      if (!student.password.startsWith('$2b$')) { // Check if already hashed
        const hashed = await bcrypt.hash(student.password, 10);
        student.password = hashed;
        await student.save();
        console.log(`✅ Student ${student.username} password hashed`);
      }
    }

    // Hash teacher passwords
    const teachers = await Teacher.find();
    for (const teacher of teachers) {
      if (!teacher.password.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(teacher.password, 10);
        teacher.password = hashed;
        await teacher.save();
        console.log(`✅ Teacher ${teacher.username} password hashed`);
      }
    }

    // Hash parent passwords
    const parents = await Parent.find();
    for (const parent of parents) {
      if (!parent.password.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(parent.password, 10);
        parent.password = hashed;
        await parent.save();
        console.log(`✅ Parent ${parent.username} password hashed`);
      }
    }

    console.log('🎉 All passwords hashed!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

hashPasswords();
