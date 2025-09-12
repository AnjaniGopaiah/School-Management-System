const mongoose = require('mongoose');
const Teacher = require('./models/Teacher'); // Adjust path if needed

require('dotenv').config();

// Use the environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const subjects = ['Maths', 'Science', 'English', 'History', 'Computer', 'Physics', 'Chemistry'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Generates timetable like: Monday: "8-10 Maths, 11-12 Science"
function generateRandomTimetable() {
  const timetable = [];

  days.forEach(day => {
    const periods = [];
    let hour = 8;

    const numPeriods = Math.floor(Math.random() * 3) + 3; // 3 to 5 periods/day

    for (let i = 0; i < numPeriods; i++) {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const endHour = hour + 1;
      periods.push(`${hour}:00-${endHour}:00 ${subject}`);
      hour = endHour;
    }

    timetable.push(`${day}: ${periods.join(', ')}`);
  });

  return timetable;
}

async function updateTeachers() {
  try {
    const teachers = await Teacher.find();

    for (let teacher of teachers) {
      teacher.email = teacher.email || `${teacher.username}@school.com`;

      // Assign random timetable
      teacher.timetable = teacher.timetable?.length ? teacher.timetable : generateRandomTimetable();

      // Assign dummy payment info
      teacher.payments = teacher.payments?.length
        ? teacher.payments
        : [{ amount: 0, date: new Date(), status: 'Paid', note: 'Currently there are no pending dues.' }];

      await teacher.save();
    }

    console.log('✅ All teacher documents updated successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error updating teachers:', error);
  }
}

updateTeachers();
