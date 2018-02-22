const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    middlewareObj = require('../middleware/index');
    
router.get('/new', middlewareObj.isLoggedIn, function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            res.render('bookings/new', {post: post, category_id: req.params.id});
        }
    });
});

router.post('/', middlewareObj.isLoggedIn, function(req, res) {
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

router.delete('/:booking_id', middlewareObj.isBookingCreator, function(req, res) {
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

router.get('/:booking_id/edit', middlewareObj.isBookingCreator, function(req, res) {
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

router.put('/:booking_id', middlewareObj.isBookingCreator, function(req, res) {
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






module.exports = router;