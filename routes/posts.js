var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Category = require("../models/category"),
    Post    = require("../models/post");
    
    
//create routes    
router.get("/new", function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('posts/new', {category: category});
        }
    });
});

router.post("/", function(req, res) {
    var newPost = new Post(req.body.post);
    // save post
    newPost.save();
    Category.findById(req.params.id, function(err, category) {
        if(err) {
            console.log(err);
        } else {
            category.posts.push(newPost);
            category.save();
            res.redirect('/');
        }
    });
});

//show route
router.get("/:post_id", function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            res.render("posts/show", {post: post});
        }
    });
});

//edit routes 
router.get("/:post_id/edit", function(req, res) {
    res.render("posts/edit");
});

router.put("/:post_id", function(req, res) {
    res.send("This is the update route for a post");
});

module.exports = router;