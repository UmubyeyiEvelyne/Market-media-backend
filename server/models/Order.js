const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity:{
        type: 'string',
        required: true,
    },
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    },
    phoneNumber: {
        type: 'string',
        required: true
    },
    shippingAddress: {
        type: 'string',
        required: true
    },
    shippingMethod: {
        type: 'string',
        required: true
    },
    orderDate: {
        type: 'string',
        required: true
    },
    status:{
        type: 'string',
        enum: ['complete', 'incomplete'],
    }
})

module.exports = mongoose.model('Order', OrderSchema);