const bcrypt = require('bcrypt');

const password = 'studentpass';
const hash = '$2b$10$t7zpqm3oqm1/9HADqccUKeEy/0VPaX/DoXtfX1AMbkk4hp06yjCsm';

bcrypt.compare(password, hash)
  .then(result => {
    console.log('Password match:', result); // should print true
  })
  .catch(err => {
    console.error('Error comparing passwords:', err);
  });
