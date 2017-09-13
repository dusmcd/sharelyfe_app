var mongoose = require("mongoose");
var postSchema = require("./post").schema;

var categorySchema = mongoose.Schema({
    name: String,
    posts: [postSchema]
});

module.exports = mongoose.model("Category",categorySchema);