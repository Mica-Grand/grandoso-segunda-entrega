const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    thumbnails: {
        type: String,
        
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    availability: {
        type: Boolean,
        default: true
    }
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema, 'products');
