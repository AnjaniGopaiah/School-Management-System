const mongoose = require('mongoose');
const Parent = require('./models/Parent');

require('dotenv').config();


// Use the environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

async function updateParents() {
  try {
    const parents = await Parent.find();

    for (let parent of parents) {
      let emailName = 'parent';
      if (parent.name) {
        const match = parent.name.match(/Parent\s*(\d+)/i);
        if (match) {
          emailName = `parent${match[1]}`;
        }
      }

      const newEmail = `${emailName}@parent.com`;

      // Update only if email is different
      if (parent.email !== newEmail) {
        parent.email = newEmail;
        await parent.save();
        console.log(`Updated: ${parent.name} → ${newEmail}`);
      }
    }

    console.log('✅ All parent emails updated successfully.');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error updating parents:', error);
  }
}

updateParents();
