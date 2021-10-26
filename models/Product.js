const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : "Category is required"
    }
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;