var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Category = require("../models/category"),
    Post    = require("../models/post");
    
//create routes    
router.get("/new", isLoggedIn, function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('posts/new', {category: category});
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if(err) {
            console.log(err);
        } else {
            Post.create(req.body.post, function(err, newPost) {
                if (err) {
                    console.log(err);
                } else {
                    newPost.author.id = req.user._id;
                    newPost.save();
                    category.posts.push(newPost);
                    category.save();
                    res.redirect('/categories/'+req.params.id +'/posts/'+newPost._id);
                }
            })
            
        }
    });
});

//show route
router.get("/:post_id", function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if(err) {
            console.log(err);
        } else {
            res.render("posts/show", 
            {post: post, category_id: req.params.id, currentUser: req.user});
        }
    });
});

//update routes 
router.get("/:post_id/edit", function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('posts/edit', {post: post, category_id: req.params.id});
        }
    });
    
    
});

router.put("/:post_id", function(req, res) {
    Post.findByIdAndUpdate(req.params.post_id, req.body.post, function(err, updatedPost) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/categories/' + req.params.id + '/posts/' + req.params.post_id);
        }
    });
});

//destroy route

router.delete('/:post_id', function(req, res) {
    Post.findByIdAndRemove(req.params.post_id, function(err) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/');
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