var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose"),
    Category = require("./models/category"),
    Post = require("./models/post"),
    User = require('./models/user'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
    
//require routes
var categoryRoutes = require("./routes/categories"),
    authRoutes     = require("./routes/index"),
    postRoutes     = require("./routes/posts");
    
//APP CONFIG
    
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require('express-session')({
    secret: 'I read the news today, oh boy.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//config passport google strategy

passport.use(new GoogleStrategy({
    consumerKey: '770264381842-63n6mu1s6me51qcl9ogm0a186hbffbs5.apps.googleusercontent.com',
    consumerSecret: 's4L2V6K4IAudfTdd5zppL7xf',
    callbackURL: "https://sharelyfe-dusmcd.c9users.io/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
  }
));

//connect to db
var promise = mongoose.connect("mongodb://localhost/sharelyfe_db", {
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

app.get('/auth/google', 
        passport.authenticate('google',{scope: 'https://www.google.com/m8/feeds'})
        );
        
app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/login'}), function(req, res) {
            res.redirect('/');
        });


//set up server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The server is listening");
});