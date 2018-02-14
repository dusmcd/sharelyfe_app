const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user');
    let result = {};
    let i = 0;


    
router.get('/users/:user_id', getBookingsByUser, getPostsByUser, function(req, res) {
    const createdByUser = req.createdByUser;
    // console.log(createdByUser);
    res.render('users/index', {createdByUser: createdByUser});
});

//middleware

function getBookingsByUser(req, res, next) {
    Booking.find({'author.id': req.user._id}, function(err, foundBookings) {
        if (!err) {
            req.bookings = foundBookings;
            return next();
        }
    });
  
}

function getPostsByUser(req, res, next) {
    Post.find({}, function(err, posts) {
        let i = 0;
        let result = {};
        if (!err) {
            req.bookings.forEach(function(foundBooking) {
                posts.forEach(function(post) {
                    if (post.bookings) {
                        post.bookings.forEach(function(postBooking) {
                            if (String(postBooking._id) === String(foundBooking._id)) {
                                result[i] = {post: post, booking: foundBooking};
                                // console.log('Property ' + i + ': ' + result[i].post);
                                i++;
                            }
                        });
                    }
                });
            });
        }
        req.createdByUser = result;
        return next();
    });
}

module.exports = router;