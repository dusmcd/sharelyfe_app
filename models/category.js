var mongoose = require("mongoose");
var postSchema = require("./post").schema;

var categorySchema = mongoose.Schema({
    name: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
});

module.exports = mongoose.model("Category",categorySchema);