var express = require("express"),
    router  = express.Router({mergeParams: true}),
    multer = require('multer'),
    Category = require("../models/category"),
    Post    = require("../models/post");
    

//congifure multer for image uploading

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/image');
    },
    filename: function(req, file, cb) {
        let mimeType = file.mimetype;
        const fileExtension = mimeType.slice(mimeType.search('/') + 1, mimeType.length);
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
    }
});

const upload = multer({storage: storage});


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
                    res.redirect('/categories/'+req.params.id +'/posts/'+ newPost._id + '/upload');
                }
            });
            
        }
    });
});

//routes to upload image to newly created post
router.get('/:post_id/upload', function(req, res) {
    res.render('posts/upload', {category_id: req.params.id, post_id: req.params.post_id});
});

router.post('/:post_id/upload', upload.single('upl'), function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            post.image.push(req.file.filename);
            post.save();
            // res.redirect('/');
            res.redirect('/categories/' + req.params.id + '/posts/' + post._id);
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
            {post: post, category_id: req.params.id});
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
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
        } else {
            category.posts.pull(req.params.post_id);
            category.save();
        }
    });
    
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