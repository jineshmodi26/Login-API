const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const key = process.env.SECRET_KEY;

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    active: {
        type : Number,
        required : true,
        default : 0 
    }
});

userSchema.pre('save', function(next){
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    return next(err)
                }
                user.password = hash;
                next();
            });
        })
    } else {
        user.active = 1
        next()
    }
});

// userSchema.methods.comparePassword = function(password){
//     const user = this;
//     return new Promise((resolve, reject)=>{
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//             if (err) {
//                 return reject(err);
//             }
//             if (!isMatch) {
//                 return reject(err);
//             }
//             return resolve(true);
//         });
//     });
// }

const User = mongoose.model('User', userSchema);

module.exports = User;