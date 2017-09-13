var express = require("express"),
    router  = express.Router(),
    Category = require("../models/category"),
    Post    = require("../models/post");
//create routes    
router.get("/new", function(req, res) {
    res.render("posts/new");
});

router.post("/", function(req, res) {
    var newPost = new Post({
        //info from form
    });
    // save post
    newPost.save();
    Category.findById(req.params.id, function(err, category) {
        if(err) {
            console.log(err);
        } else {
            category.posts.push(newPost);
        }
    });
});

//show route
router.get("/:id", function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            res.render("posts/show", {post: post});
        }
    });
});

//edit routes 
router.get("/:id/edit", function(req, res) {
    res.render("posts/edit");
})

router.put("/:id", function(req, res) {
    res.send("This is the update route for a post");
})

module.exports = router;