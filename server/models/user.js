const db = require('./db');
const Sequelize = require('sequelize');

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
