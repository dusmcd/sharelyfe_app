// connect all models here and export
const db = require('./db');
const User = require('./user');
const Post = require('./post');
const Category = require('./category');
const Booking = require('./booking');

// associations

Post.belongsTo(User);
User.hasMany(Post);
Booking.belongsTo(User);
User.hasMany(Booking);
Booking.belongsTo(Post);
Post.hasMany(Booking);

Post.belongsToMany(Category, { through: 'category_post' });
Category.belongsToMany(Post, { through: 'category_post' });

module.exports = {
  db,
  Booking,
  Post,
  User,
  Category,
};
