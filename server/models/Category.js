const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    image: {
        type: 'string',
        required: true,
    },
    name: {
        type: 'string',
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }

    ]
})

module.exports = mongoose.model('Category', CategorySchema);