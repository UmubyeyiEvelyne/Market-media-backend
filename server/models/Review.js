const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    },
    rating: {
        type: 'number',
        required: true
    },
    comment: {
        type: 'string',
        required: true
    },
    dateAdded:{
        type: 'string',
        required: true
    }
    
});

module.exports = mongoose.model('Review', ReviewSchema);