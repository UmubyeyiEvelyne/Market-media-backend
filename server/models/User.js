const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    phoneNumber: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    }, 
    category: {
        type: 'string',
        enum: ['Admin', 'Seller', 'Buyer'],
    }, 
})

module.exports = mongoose.model('User', userSchema);