const express = require("express"),
    router  = express.Router({mergeParms: true}),
    Category = require("../models/category"),
    middlewareObj = require('../middleware/index');
    

//index route for categories
router.get('/', middlewareObj.isLoggedIn, function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('categories/index', {categories: categories});
        }
    });
});

//create routes

router.get("/new", middlewareObj.isLoggedIn, middlewareObj.isOwner, function(req, res) {
    res.render("categories/new");
});

router.post("/", middlewareObj.isLoggedIn, middlewareObj.isOwner, function(req, res) {
    Category.create({name: req.body.name}, function(err, newCategory) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//show route
router.get("/:id", function(req, res) {
    Category.findById(req.params.id).populate('posts').exec(function(err, category) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('categories/show', {category: category});
            // console.log(category.posts[0]);
        }
    });
});





module.exports = router;