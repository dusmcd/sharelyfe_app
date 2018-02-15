var mongoose = require("mongoose");
const bookingSchema = require('./booking').schema;

var postSchema = mongoose.Schema({
    image: [String],
    title: String,
    description: String,
    price: String,
    bookings: [bookingSchema],
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
            }
        }   
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);