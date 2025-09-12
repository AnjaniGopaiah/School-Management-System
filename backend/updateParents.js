const mongoose = require('mongoose');
const Parent = require('./models/Parent');

mongoose.connect('mongodb+srv://vishnua7509:V%21shnu%4004@cluster0.hzt3v96.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


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
