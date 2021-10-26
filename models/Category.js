const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : "Category name is required"
    }
});

const Category = mongoose.model('Category',categorySchema);

module.exports = Category