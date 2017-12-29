var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    image: [String],
    title: String,
    description: String,
    price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);