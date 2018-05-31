const db = require('./db')
const Sequelize = require('sequelize')

const Post = db.define('post', {
  imageUrl: {
    type: Sequelize.STRING,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
})

module.exports = Post
