const mongoose = require('mongoose');
const Student = require('./models/Student'); // adjust path if needed

require('dotenv').config();

// Use the environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

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
