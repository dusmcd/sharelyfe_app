const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user');
    
    
router.get('/users/:username', getUserBookings, getPostsWithBookings, function(req, res) {
    const createdByUser = req.result;
    let createdForUser = req.userPosts;
    
    User.find({}, handleUsers);
    
    function handleUsers(err, users) {
        if (err) {
            console.log(err);
        } else {
            users.forEach(scanUsers);
        }
        res.render('users/index', {createdByUser: createdByUser, createdForUser: createdForUser});
    }
    
    function scanUsers(user) {
        handleObjects(user);
    }
    
    function handleObjects(user) {
        createdForUser.forEach(function(postAndBooking, i, array) {
            if (String(postAndBooking.booking.author.id) === String(user._id)) {
                array[i].user = user;
            }
        });
    }
    

    
});

// *************** middleware ************************//

// probably needs to be refactored using promises
// finds the posts associated with bookings created by current user

function getUserBookings(req, res, next) {
    Post.find({}, getPosts);
    
    function getPosts(err, posts) {
        req.result = [];
        if (err) {
            console.log(err);
        } else {
            posts.forEach(scanPosts);
        }
        return next();
    }
    
    function scanPosts(post) {
        if (post.bookings) {
            scanBookings(post);
        }
    }
    
    function scanBookings(post) {
        post.bookings.forEach(function(booking) {
            if (String(booking.author.id) === String(req.user._id)) {
                req.result.push({post: post, booking: booking});
            }
        });
    }
    
}

// compile the posts that were created by the current user, which have bookings

function getPostsWithBookings(req, res, next) {
    Post.find({'author.id': req.user._id}, getPosts);
    
    function getPosts(err, posts) {
        req.userPosts = [];
        if (err) {
            console.log(err);
        } else {
            posts.forEach(scanPosts);
        }
        return next();
    }
    
    function scanPosts(post) {
        if (post.bookings) {
            scanBookings(post);
        }
    }
    
    function scanBookings(post) {
        post.bookings.forEach(function(booking) {
            req.userPosts.push({post: post, booking: booking});
        });
    }
    
    
    
}

        
module.exports = router;