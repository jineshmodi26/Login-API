const Product = require('../models/Product');
const Category = require('../models/Category');
const { removeAllListeners } = require('nodemon');

module.exports = {
    addProduct : async (req,res) => {
        try{
            const {name,price,category} = req.body;
            const product = new Product({
                name : name,
                price : price,
                category : category
            });
            await product.save();
            res.json({
                msg : 'Success'
            })
        }catch(err){
            res.json({
                error : err.message
            })
        }
    },
    getProduct : async (req, res) =>{
        const priceLow = req.query.priceLow || 0;
        const priceHigh = req.query.priceHigh || 1000000;
        const search = req.query.search || '';
        const sortItem = req.query.field || 'name'; //changed to relevance date
        const direction = req.query.direction || 'asc';
        const page = req.query.page;
        const category = req.query.category;
        var categoryId = null;

        if (category) {
            await Category.find({name : {$regex : category}}).then((category)=>{ 
                categoryId = category[0]._id;
            }).catch((error)=>{
                res.json({
                    error : error.message
                })
            });

            await Product.find({name : {$regex : search}, price : {$gt : priceLow, $lt : priceHigh}, category : categoryId}).sort([[sortItem , direction]]).limit(10).populate('category').then((products)=>{
                res.json({products});
            }).catch((err)=>{
                res.json({
                    error : err.message
                })
            })
        } else {
            await Product.find({name : {$regex : search}, price : {$gt : priceLow, $lt : priceHigh}}).sort([[sortItem , direction]]).limit().populate('category').then((products)=>{
                res.json({products});
            }).catch((err)=>{
                res.json({
                    error : err.message
                })
            })
        }
    },
    viewProduct : async (req,res) => {
        try {
            await Product.findById({_id : req.params.id}).populate('category').then((product) => {
                res.json({
                    product
                })
            }).catch((err) => {
                res.json({
                    error : err.message
                })
            })
        }catch (err) {
            res.json({
                error : err.message
            })
        }
    },
    updateProduct : async (req,res) => {
        const id = req.params.id;
        const {name,price,category} = req.body;
        try {
            await Product.findByIdAndUpdate(id, {name : name, price : price, category : category},{new : true}).then((product) => {
                res.json({
                    message : 'Updated Successfully'
                })
            }).catch((err) => {
                res.json({
                    error : 'Error Occured While Updating Product'
                })
            });
        }catch (err) {
            res.json({
                error : 'Error Occured While Updating Product'
            })
        }
    },
    deleteProduct : async (req, res) => {
        const id = req.params.id;
        try {
            await Product.findByIdAndDelete(id).then((product) => {
                res.json({
                    message : 'Product Deleted Successfully'
                })
            }).catch((err) => {
                res.json({
                    error : 'Error Occured While Deleting Product'
                })
            });
        } catch (err) {
            res.json({
                error : 'Error Occured While Deleting Product'
            })
        }
    }
};