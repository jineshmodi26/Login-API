const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

const productSchema = mongoose.Schema({
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        required : true
    },
    image : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    discountPrice : {
        type : Number
    },
    rating : {
        type : Number,
        required : true
    },
    totalquantity : {
        type : Number,
        required : true
    }
});

const cartSchema = mongoose.Schema({
    items : [
        {
            product : {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity : Number,
            default : 1
        }
    ]
});

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    active : {
        type : Number,
        default : 0,
        required : true
    },
    address : {
        location : {
            type : String,
            required : true
        },
        landmark : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : Number,
            required : true
        }
    },
    cart : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Cart'
    }
});