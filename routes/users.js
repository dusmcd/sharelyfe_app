const express = require('express'),
    router  = express.Router({mergeParams: true}),
    Post    = require('../models/post'),
    Booking = require('../models/booking'),
    User    = require('../models/user'),
    middlewareObj = require('../middleware/index'),
    middleware = [
                  middlewareObj.isLoggedIn,
                  middlewareObj.getUserBookings, 
                  middlewareObj.getPostsWithBookings
             ];
    
router.get('/users/:username', middleware, function(req, res) {
    const createdByUser = req.result;
    let createdForUser = req.userPosts;
    
    User.find({}, handleUsers); // find users who made bookings for current user's posts
    
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



        
module.exports = router;