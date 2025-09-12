const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Student = require('./models/Student');
const Parent = require('./models/Parent');
const Teacher = require('./models/Teacher');

dotenv.config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Student.deleteMany({});
    await Parent.deleteMany({});
    await Teacher.deleteMany({});
    console.log('✅ Cleared Student, Parent, and Teacher collections');

    const students = [];
    const parents = [];

    // 1. Create Students
    for (let i = 1; i <= 4; i++) {
      const student = new Student({
        studentId: `S00${i}`,
        username: `student${i}`,
        password: 'studentpass',
        name: `Student ${i}`,
        class: `Class ${i}`,
        marks: [
          { subject: 'Math', score: 80 + i },
          { subject: 'Science', score: 75 + i }
        ],
        attendanceSummary: {
          presentDays: 10 + i,
          totalDays: 15
        }
      });
      students.push(await student.save());
    }
    console.log('✅ Created students');

    // 2. Create Parents linked to Students
    for (let i = 0; i < students.length; i++) {
      const parent = new Parent({
        parentId: `P00${i + 1}`,
        username: `parent${i + 1}`,
        password: 'parentpass',        name: `Parent ${i + 1}`,
        student: students[i]._id
      });
      const savedParent = await parent.save();

      // link parent back to student
      students[i].parent = savedParent._id;
      await students[i].save();

      parents.push(savedParent);
    }
    console.log('✅ Created parents and linked to students');

    // 3. Create Teachers
    const teacher1 = new Teacher({
      teacherId: 'T001',
      username: 'teacher1',
      password: 'teacherpass1',
      name: 'Teacher One',
      subjects: ['Math', 'English'],
      students: [students[0]._id, students[2]._id] // S001 and S003
    });

    const teacher2 = new Teacher({
      teacherId: 'T002',
      username: 'teacher2',
      password: 'teacherpass2',
      name: 'Teacher Two',
      subjects: ['Science', 'History'],
      students: [students[1]._id, students[3]._id] // S002 and S004
    });

    await teacher1.save();
    await teacher2.save();
    console.log('✅ Created 2 teachers with assigned students');

  } catch (err) {
    console.error('❌ Seeder error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  }
}

seedData();
