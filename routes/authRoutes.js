const express =require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const key = process.env.SECRET_KEY;
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


router.get('/', (req, res) => {
    res.send('HEllO');
})

const sendMail = async (email, subject, text) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'jineshmodi99@gmail.com', // generated ethereal user
          pass: 'Jin999$999', // generated ethereal password
        },
      });
    
    let info = await transporter.sendMail({
        from: '"Jinesh Modi" <jineshmodi99@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        // html: "<b>Hello world?</b>", // html body
    });

    // console.log("Message sent: %s", info.messageId);
    return info.messageId;
}

router.post('/signup',async (req, res)=>{
    const {email, password} = req.body;
    const validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var validPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (validEmail.test(email) === true && validPassword.test(password) === true) {
        const user = new User({
            email : email,
            password : password
        });
        try{
            await user.save();
            const token = jwt.sign({id : user._id}, key);
            return res.json({
                token : token
            });
        } catch(err) {
            return res.json({
                error : 'Email Already Exist'
            });
        }
    } else {
        if (validEmail.test(email) === false || validPassword.test(password) === false) {
            if (validEmail.test(email) === false) {
                return res.json({
                    emailError : 'Invalid Email'
                })
            }
            if (validPassword.test(password) === false) {
                return res.json({
                    passwordError : 'Password must be 6 and must contain number and special character'
                })
            }
        }
    }
});

router.post('/signin',async (req, res)=>{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.json({
            error :'Invalid Email or Password'
        });
    } else {
        await User.findOne({email : email}).then((user)=>{
            if (!user) {
                return res.json({
                    error :'User Not Found'
                });
            } else {
                bcrypt.compare(password, user.password,async (err, isMatch) => {
                    if (err) {
                        return res.json({
                            error :'Invalid Password'
                        });
                    }
                    if (isMatch) {
                        const token = jwt.sign({id : user._id}, key);
                        if (user.active === 0) {
                            const messageID = await sendMail(email,'Account activation',`Hello,${email}\n Please Active Your Account By clicking on the link http://localhost:5000/auth-user/active/${token}`).catch(console.error);
                            if (messageID) {
                                return res.json({
                                    message : 'Account activation link sent at your email'
                                })
                            } else {
                                return res.json({
                                    error : 'Activation Failed'
                                });   
                            }
                        } else {
                            res.cookie('jwt',token,{
                                expires : new Date(new Date().getTime() + 2628000000),
                                // httpOnly : true
                            });
                            return res.json({
                                token : token
                            })
                        }
                    } else {
                        return res.json({
                            error : 'Invalid Password'
                        })
                    }
                })
            }
        }).catch((err)=>{
            res.send(err.message)
        })
    }
});

router.get('/active/:token',async (req,res)=>{
    const token = req.params.token;
    await jwt.verify(token, key, function(err, decoded) {
        if (err) {
            return res.send('Activation Failed');
        }
        User.findOne({_id : decoded.id}).then((user)=>{
            if (!user) {
                return res.send('Activation Failed');
            } else {
                if (user.active === 0) {
                    user.active = 1;
                    user.save();
                    return res.redirect('http://localhost:3000/signin');
                } else {
                    return res.redirect('http://localhost:3000/signin');
                }
            }
        }).catch((err)=>{
            return res.send(err);
        });
    });
});

router.post('/forgot-password', async (req,res)=>{
    const {email} = req.body;
    await User.findOne({email : email}).then(async (user)=>{
        if (!user) {
            res.json({
                error : 'User not found'
            });     
        } else {
            const token = jwt.sign({id : user._id},key);
            const messageID = await sendMail(email,'Forgot Password',`Hello,${email}\n Change your password By clicking on the link http://localhost:3000/change-password?user=${token}`).catch(console.error);
            if (messageID) {
                return res.json({
                    message : 'Change Password using link sent at your email'
                })
            } else {
                return res.json({
                    error : 'Error ocurred'
                });   
            }
        }
    });
});

router.post('/change-password/:token',async (req, res) => {
    const {password, cpassword} = req.body;
    const token = req.params.token;
    var validPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    
    if (password !== cpassword) {
        res.json({
            error : "Both password must be same"
        })
    } else {
        if (!validPassword.test(password)) {
            res.json({
                error : 'Password must be 6 and must contain number and special character'
            })
        } else {
            await jwt.verify(token, key, async (err, decode)=>{
                if (err) {
                    res.json({
                        error : 'Error ocurred'
                    })
                } else {
                    await User.findOne({_id : decode.id}).then((user)=>{
                        user.password = password;
                        user.save();
                        res.json({
                            message : 'Password changed successfully'
                        })
                    }).catch((error)=>{
                        res.json({
                            error : 'Error ocurred'
                        })
                    })
                }
            });
        }
    }
});

module.exports = router;