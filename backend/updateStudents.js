const mongoose = require('mongoose');
const Student = require('./models/Student'); // adjust path if needed


mongoose.connect('mongodb+srv://vishnua7509:V%21shnu%4004@cluster0.hzt3v96.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updateEmail() {
  try {
    const student = await Student.findOne({ name: 'Student 1' });

    if (!student) {
      console.log('Student not found');
      return;
    }

    student.email = 'vishnu.a7509@gmail.com';
    await student.save();

    console.log('✅ Email updated successfully');
  } catch (err) {
    console.error('❌ Error updating email:', err);
  } finally {
    mongoose.connection.close();
  }
}

updateEmail();
