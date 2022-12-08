const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    image: {
        type: 'string',
    },
    name: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
        // enum: ['Food and Drinks', 'Electronics', 'Clothing', 'Personal Care', 'Fitness'],
    },                                                                                             
    unit: {
        type: 'string',
        required: true,
    },
    quantity: {
        type: 'number',
        required: true,
    },
    price: {
        type: 'number',
        required: true,
    },
    manufacturer:{
        type: 'string',
    },
    dateAdded: {
        type: 'string',
    },
    businessId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business'
    }
})

module.exports = mongoose.model('Product', ProductSchema);