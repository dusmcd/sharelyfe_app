var express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking');
    
router.get('/new', isLoggedIn, function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render('bookings/new', {post: post, category_id: req.params.id});
        }
    });
});

router.post('/', isLoggedIn, function(req, res) {
    const newReservation = new Booking(req.body.booking);
    
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            newReservation.author.id = req.user._id;
            post.bookings.push(newReservation);
            post.save();
            newReservation.save();
            res.send('Reservation saved!');
        }
    });
    
});

// destroy route

router.delete('/:booking_id', function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            post.bookings.pull(req.params.booking_id);
            post.save();
        }
    });
    
    Booking.findByIdAndRemove(req.params.booking_id, function(err) {
        if (err) {
            console.log(err);
            res.redirect('/users' + req.user._id);
        } else {
            console.log('Reservation deleted');
            res.redirect('/users/' + req.user._id);
        }
    });
});

// update route

router.get('/:booking_id/edit', getUserBookings, function(req, res) {
    res.send('This is the "edit" route for bookings');
    
    // const createdByUser = req.result;
    // res.render('bookings/edit', {createdByUser: createdByUser});
});


//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}
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