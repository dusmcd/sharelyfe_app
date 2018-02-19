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
            res.redirect('/users/' + req.user.username);
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
            res.redirect('/users' + req.user.username);
        } else {
            // console.log('Reservation deleted');
            res.redirect('/users/' + req.user.username);
        }
    });
});

// update routes

router.get('/:booking_id/edit', function(req, res) {
    // res.send('This is the "edit" route for bookings');
    
    Post.findById(req.params.post_id, handlePost);
    
    function handlePost(err, post) {
        if (err) {
            console.log(err);
        } else {
            handleBooking(post);
        }
    }
    
    function handleBooking(post) {
        Booking.findById(req.params.booking_id, function(err, booking) {
            if (err) {
                console.log(err);
            } else {
                res.render('bookings/edit', {post: post, booking: booking});
            }
        });
    }
});

router.put('/:booking_id', function(req, res) {
    // res.send('This is the "PUT" route for updating bookings');
    
    // updating the booking schema sub doc in the post schema
    Post.findById(req.params.post_id, function(err, post) {
        if (!err) {
            post.bookings.forEach(function(booking, i, bookingArray) {
                if (String(booking._id) === String(req.params.booking_id)) {
                    bookingArray[i].payment = req.body.payment;
                    bookingArray[i].date = req.body.date;
                }
            });
            post.save();
        }
    });
    
    // updating the booking schema
    const bookingUpdates = {date: req.body.date, payment: req.body.payment}; 
    Booking.findByIdAndUpdate(req.params.booking_id, bookingUpdates, function(err, booking) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/users/' + req.user._id);
        }
    });
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

function isOriginalUser(req, res, next) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            if (String(post.author.id) === String(req.user._id)) {
                return next();
            }
            res.redirect('/');
        }
    });
}





module.exports = router;