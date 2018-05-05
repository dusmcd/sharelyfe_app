const Sequelize = require('Sequelize');
const db = new Sequelize('postgres://localhost:5432/sharelyfe', {
  logging: false,
});

// db
//   .authenticate()
//   .then(() => {
//     console.log('db is connected');
//   })
//   .catch(err => {
//     console.error(err);
//   });

module.exports = db;
