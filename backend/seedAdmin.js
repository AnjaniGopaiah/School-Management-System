// seedAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vishnua7509:V%21shnu%4004@cluster0.hzt3v96.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  seedAdmin();
}).catch(err => console.error('MongoDB error:', err));

async function seedAdmin() {
  try {
    const existing = await Admin.findOne({ username: 'adminuser' });
    if (existing) {
      console.log('Admin user already exists');
      return process.exit();
    }

    const admin = new Admin({
      adminId: 'A001',
      username: 'admin',
      email: 'vishnuvardhan.22bce20195@vitapstudent.ac.in',
      password: 'admin123' // ⚠️ Plain text for dev; use bcrypt in prod
    });

    await admin.save();
    console.log('✅ Admin user created');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
}
