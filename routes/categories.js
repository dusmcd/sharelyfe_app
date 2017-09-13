var express = require("express"),
    router  = express.Router(),
    Category = require("../models/category");
    
//routes

//index route for categories
router.get('/', function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('categories/index', {categories: categories});
        }
    });
});

router.get("/new", function(req, res) {
    res.render("categories/new");
});

router.post("/", function(req, res) {
    Category.create({name: req.body.name}, function(err, newCategory) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/:id", function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if(err) {
            console.log(err);
        } else {
            var posts = category.posts;
            res.render("categories/show", {category: category, posts: posts});
        }
    });
});





module.exports = router;