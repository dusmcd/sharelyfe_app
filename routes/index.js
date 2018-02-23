var express = require("express"),
    router  = express.Router(),
    Category = require("../models/category"),
    Post    = require('../models/post'),
    User    = require('../models/user'),
    passport = require('passport');





router.get("/", function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            console.log(err);
        } else {
            Post.find({}, function(err, posts) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('landing', {categories: categories, posts: posts});
                }
            });
        }
    });
    
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    var registeredUser = {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    };
    User.register(new User(registeredUser), req.body.password, function(err, newUser) {
        if(err) {
            console.log(err);
            res.redirect('/');
        }
        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login');
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;