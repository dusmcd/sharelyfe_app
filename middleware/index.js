const Post = require('../models/post'),
      Booking = require('../models/booking');

let middlewareObj;

middlewareObj = {
    isLoggedIn: isLoggedIn,    
    isOriginalUser: isOriginalUser,
    getUserBookings: getUserBookings,
    getPostsWithBookings: getPostsWithBookings,
    isBookingCreator: isBookingCreator,
    isOwner: isOwner
};


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
        } 
        else if (!req.user) {
            res.redirect('/');
        }
        else {
            if (String(post.author.id) === String(req.user._id)) {
                return next();
            }
            res.redirect('/');
        }
    });
}

function isBookingCreator(req, res, next) {
    Booking.findById(req.params.booking_id, function(err, booking) {
        if (err) {
            console.log(err);
        } else {
            if (String(booking.author.id) === String(req.user._id)) {
                return next();
            } else {
                res.redirect('/');
            }
        }
    });
}

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

function isOwner(req, res, next) {
    if (String(req.user._id) === '5a90e2cff3a1a2001431d08a') {
        return next();
    } else {
        res.redirect('/');
    }
}



module.exports = middlewareObj;