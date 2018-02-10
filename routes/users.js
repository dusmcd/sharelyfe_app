const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user');
    
router.get('/users/:user_id', bookingsCreated,bookingsInPosts,
            function(req, res) {
    // let userBookings = [];
    let bookedByUser = req.bookings;
    let bookedForUser = req.postBookings;
    console.log('Booked by user at route: ' + bookedByUser);
    console.log('Booked for user at route: ' + bookedForUser);
    
    res.redirect('/');

    
    // User.findById(req.params.user_id, function(err, user) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         Booking.find({}, function(err, bookings) {
    //             if (err) {
    //                 console.log(err);
    //             } else {
    //                 bookings.forEach(function(booking) {
    //                      if(String(booking.author.id) === String(req.params.user_id)) {
    //                         userBookings.push(booking);
    //                      }
    //                 });
    //                 res.render('users/index', {user: user, userBookings: userBookings});
    //             }
                
    //         });         
    //     }
    // });
});

// to find the bookings associated with a given user (helper function)
function bookingsCreated(req, res, next) {
    Booking.find({'author.id': String(req.user._id)}, function(err, foundBookings) {
        if (err) {
            console.log(err);
        } 
            // console.log('Bookings created by user: ' + foundBookings);
            req.bookings = foundBookings;
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
                        console.log('Booking: ' + booking);
                        allBookings.push(booking);
                        // console.log('allBookings variable: ' + allBookings);
                    });       
                }
            });
            console.log('allBookings variable: ' + allBookings);
            req.postBookings = allBookings;
            return next();
        }
    });
    
}
    
    
module.exports = router;