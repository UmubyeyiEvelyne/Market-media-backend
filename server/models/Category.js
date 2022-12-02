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
})

module.exports = mongoose.model('Category', CategorySchema);