var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    image: String,
    title: String,
    description: String,
    price: String
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);