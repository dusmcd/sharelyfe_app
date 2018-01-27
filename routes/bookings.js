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


//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/login');
    }
}

module.exports = router;