const express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose"),
    // Category = require("./models/category"),
    // Post = require("./models/post"),
    User = require('./models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');
    
//require routes
const categoryRoutes = require("./routes/categories"),
    authRoutes     = require("./routes/index"),
    postRoutes     = require("./routes/posts");
    
//APP CONFIG

//current user available for all routes
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
    
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require('express-session')({
    secret: 'I read the news today, oh boy.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//connect to db
const promise = mongoose.connect("mongodb://localhost/sharelyfe_db", {
    useMongoClient: true
});
promise.then();

// use routes
app.use("/categories",categoryRoutes);
app.use('/categories/:id/posts', postRoutes);
app.use(authRoutes);

// passport config

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set up server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server is listening");
});