const db = require('./db');
const Sequelize = require('sequelize');

const Booking = db.define('booking', {
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  payment: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Booking;
