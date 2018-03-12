const express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    mongoose    = require('mongoose'),
    Category = require('./models/category'),
    Post = require('./models/post'),
    User = require('./models/user'),
    Booking = require('./models/booking'),
    passport = require('passport'),
    cloudinary = require('cloudinary'),
    LocalStrategy = require('passport-local');
    
//require routes
const categoryRoutes = require('./routes/categories'),
    authRoutes     = require('./routes/index'),
    postRoutes     = require('./routes/posts'),
    bookingRoutes  = require('./routes/bookings'),
    userRoutes     = require('./routes/users');
    
//APP CONFIG

// configure cloudinary for uploading images to cloud storage
cloudinary.config({
    cloud_name: 'dz7ejmv18',
    api_key: '756354461611933',
    api_secret: 'MJ4SzYkSFjA4eLlUXwhWUf_59dU'
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(require('express-session')({
    secret: 'I read the news today, oh boy.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

const promise = mongoose.connect('mongodb://dusmcd:nitsud181@ds247178.mlab.com:47178/sharelyfe_db', {
    useMongoClient: true
});

// connect to db
// const promise = mongoose.connect('mongodb://localhost/sharelyfe_db', {
//     useMongoClient: true
// });
promise.then();

// passport config

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//current user available for all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});



app.get('/posts/:post_id', function(req, res) {
    // res.send('Welcome to posts/:post_id route.');
    Category.find({}, getCategories);
    
    function getCategories(err, categories) {
        if (err) {
            console.log(err);
        } else {
            categories.forEach(scanCategories);
        }
    }
    
    function scanCategories(category) {
        category.posts.forEach(function(post) {
            scanPosts(category, post);
        });
    }
    
    function scanPosts(category, post) {
        if (String(req.params.post_id) === String(post)) {
            res.redirect('/categories/' + category._id + '/posts/' + req.params.post_id);   
        }
    }
    
});

// use routes
app.use('/categories',categoryRoutes);
app.use('/categories/:id/posts', postRoutes);
app.use('/categories/:id/posts/:post_id/bookings', bookingRoutes);
app.use(authRoutes);
app.use(userRoutes);

//set up server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log('The server is listening very well');
});