const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user');
    
    
router.get('/users/:user_id', getUserBookings, function(req, res) {
    const createdByUser = req.result;
    // console.log(createdByUser);
    // res.redirect('/');
    res.render('users/index', {createdByUser: createdByUser});
});

// *************** middleware ************************//

// probably needs to be refactored using promises
// finds the posts associated with bookings created by current user

function getUserBookings(req, res, next) {
    Post.find({}, function(err, posts) {
        req.result = [];
        if (!err) {
            posts.forEach(function scanPosts(post) {
                if (post.bookings) {
                    post.bookings.forEach(function scanBookings(booking) {
                        if (String(booking.author.id) === String(req.user._id)) {
                            req.result.push({post: post, booking: booking});
                        }
                    });
                }
            });
        }
        return next();
    });
    
}

        
module.exports = router;