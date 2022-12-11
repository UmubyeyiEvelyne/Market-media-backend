const mongoose = require('mongoose');
const Review = require('./Review');

const BusinessSchema = mongoose.Schema({
    image: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
        required: true,
    },
    webLink: {
        type: 'string', 
    },
    socialMediaLink: {
        type: 'string', 
    },
    email: {
        type: 'string',
        required: true,
    },
    phoneNumber: {
        type: 'string',
        required: true,
    },
    province: {
        type: 'string',
        required: true,
    },
    district: {
        type: 'string',
        required: true,
    },
    streetAddress: {
        type: 'string'
    },
    otherAddressDescription: {
        type: 'string', 
    },
    legalDocument: {
        type: 'string',
        required: true,
    },
    applicationStatus: {
        type: 'string',
        enum: ['Approved', 'Rejected', 'Pending']
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    },
        
    // addedProducts: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,  /** why can't we have a sellerId foreign key in products instead */
    //         ref: 'Product'
    //     }
    // ],
    // ordersReceived: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,  /** why can't we have a sellerId foreign key in orders instead */
    //         ref: 'Order'
    //     }
    // ], 
    // reviewsReceived: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,  /** why can't we have a sellerId foreign key in reviews instead */
    //         ref: 'Review'
    //     }
    // ],

})

module.exports = mongoose.model('Business', BusinessSchema);