const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const mongoose = require('mongoose');
// const Category = require('./models/category');
// const Post = require('./models/post');
// const User = require('./models/user'),;
// const Booking = require('./models/booking');
const passport = require('passport');
const cloudinary = require('cloudinary');
const LocalStrategy = require('passport-local');
const path = require('path');
const { db } = require('./models'); // connect to db

//require routes
// const categoryRoutes = require('./routes/categories'),
//   authRoutes = require('./routes/index'),
//   postRoutes = require('./routes/posts'),
//   bookingRoutes = require('./routes/bookings'),
//   userRoutes = require('./routes/users');

//APP CONFIG

// configure cloudinary for uploading images to cloud storage
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.KEY,
  api_secret: process.env.SECRET,
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '..', 'public')));
// app.use(
//   require('express-session')({
//     secret: 'I read the news today, oh boy.',
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// passport config

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

//current user available for all routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// app.get('/posts/:post_id', function(req, res) {
//   // res.send('Welcome to posts/:post_id route.');
//   Category.find({}, getCategories);

//   function getCategories(err, categories) {
//     if (err) {
//       console.log(err);
//     } else {
//       categories.forEach(scanCategories);
//     }
//   }

//   function scanCategories(category) {
//     category.posts.forEach(function(post) {
//       scanPosts(category, post);
//     });
//   }

//   function scanPosts(category, post) {
//     if (String(req.params.post_id) === String(post)) {
//       res.redirect(
//         '/categories/' + category._id + '/posts/' + req.params.post_id
//       );
//     }
//   }
// });

// use routes
// app.use('/categories', categoryRoutes);
// app.use('/categories/:id/posts', postRoutes);
// app.use('/categories/:id/posts/:post_id/bookings', bookingRoutes);
// app.use(authRoutes);
// app.use(userRoutes);

const PORT = 8080;

//set up server
app.listen(8080, 'localhost', function() {
  console.log(`The server is listening on port ${PORT}`);
});
