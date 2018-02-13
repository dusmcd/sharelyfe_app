const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user');
    
router.get('/users/:user_id', bookingsCreated,bookingsInPosts,
            function(req, res) {
    const createdByUser = req.viewData;
    
    res.render('users/index', {createdByUser: createdByUser});
});

// to find the bookings associated with a given user (helper function)
function bookingsCreated(req, res, next) {
    // querying for all bookings created by curret user
    Booking.find({'author.id': String(req.user._id)}, function(err, foundBookings) {
        let relevantPosts = [];
        if (err) {
            console.log(err);
        }
        // querying for posts associated with bookings. Needed for data to be diaplyed in user profile
        // console.log(foundBookings);
        foundBookings.forEach(function(foundBooking) {
            Post.find({}, function(err, posts) {
                if (err) {
                    console.log(err);
                } else {
                    posts.forEach(function(post) {
                        post.bookings.forEach(function(postBooking) {
                            if (String(postBooking._id) === String(foundBooking._id)) {
                                relevantPosts.push(post);
                                console.log('Posts array: ' + relevantPosts);
                            }
                        });
                    });
                }
            });
        });
        
        req.viewData = {posts: relevantPosts, bookings: foundBookings};
        // console.log('Posts with user bookings: ' + relevantPosts);
        return next();
    });
}

// to find the posts created by a given user, and then find bookings for those
// posts (if any) (helper function)
function bookingsInPosts(req, res, next) {
    Post.find({'author.id': String(req.user._id)}, function(err, foundPosts) {
        if (err) {
            console.log(err);
        } else {
            let allBookings = [];
            // console.log('Posts created by user: ' + foundPosts);
            foundPosts.forEach(function(post) {
                if (post.bookings) {
                    post.bookings.forEach(function(booking) {
                        // console.log('Booking: ' + booking);
                        allBookings.push(booking);
                        // console.log('allBookings variable: ' + allBookings);
                    });       
                }
            });
            // console.log('allBookings variable: ' + allBookings);
            req.postBookings = allBookings;
            return next();
        }
    });
    
}
    
    
module.exports = router;