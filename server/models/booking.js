const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    date: Date,
    payment: String
    
}, {timestamps: true});

module.exports = mongoose.model('Booking', bookingSchema);