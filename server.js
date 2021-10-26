const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port = 5000 ||  process.env.PORT
const mongo_url = process.env.MONGO_URL
const router = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');

mongoose.connect(mongo_url,{useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());
app.use('/auth-user',router);
app.use('/product', productRouter);
app.use('/category',categoryRouter);

app.listen(port, ()=>{
    console.log(`Server Running on ${port}`)
});
