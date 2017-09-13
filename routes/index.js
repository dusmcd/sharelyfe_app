var express = require("express"),
    router  = express.Router(),
    Category = require("../models/category");





router.get("/", function(req, res) {
    Category.find({}, function(err, categories) {
        if (err){
            console.log(err);
        } else {
            res.render("landing", {categories: categories});
        }
    });

});


module.exports = router;