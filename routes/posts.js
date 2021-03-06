const express = require("express"),
    router  = express.Router({mergeParams: true}),
    multer = require('multer'),
    Category = require("../models/category"),
    Post    = require("../models/post"),
    middlewareObj = require('../middleware/index'),
    cloudinary = require('cloudinary');
    


//congifure multer for image uploading

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/image');
    },
    filename: function(req, file, cb) {
        let mimeType = file.mimetype;
        // parsing the mimetype field of storage object in order to get a valid
        // file name for images
        const fileExtension = mimeType.slice(mimeType.search('/') + 1, mimeType.length);
        cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
    }
});

const upload = multer({storage: storage});


//create routes    
router.get("/new", middlewareObj.isLoggedIn, function(req, res) {
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('posts/new', {category: category});
        }
    });
});

router.post("/", middlewareObj.isLoggedIn, function(req, res) {
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
router.get('/:post_id/upload', middlewareObj.isOriginalUser, function(req, res) {
                
    res.render('posts/upload', {category_id: req.params.id, 
                                post_id: req.params.post_id});
});

router.post('/:post_id/upload', middlewareObj.isOriginalUser, upload.single('upl'), function(req, res) {
    
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
        } else {
            // logic to determine whether to save the 'default' image
            if (req.file) {
                cloudinary.uploader.upload('./public/image/' + req.file.filename, function(result) {
                // console.log(result.secure_url);
                post.image.push(result.secure_url);
                post.save();
                res.redirect('/categories/' + req.params.id + '/posts/' + post._id);
            });
            }
            else {
                var fileName = 'https://res.cloudinary.com/dz7ejmv18/image/upload/v1520881579/g7ocjbjjty66tqk13w0t.jpg';
                // console.log(result.secure_url);
                post.image.push(fileName);
                post.save();
                res.redirect('/categories/' + req.params.id + '/posts/' + post._id);
            }
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
router.get("/:post_id/edit", middlewareObj.isOriginalUser, function(req, res) {
    Post.findById(req.params.post_id, function(err, post) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('posts/edit', {post: post, category_id: req.params.id});
        }
    });
    
    
});

router.put("/:post_id", middlewareObj.isOriginalUser, function(req, res) {
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

router.delete('/:post_id', middlewareObj.isOriginalUser, function(req, res) {
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



module.exports = router;