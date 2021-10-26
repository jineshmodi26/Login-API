const Category = require('../models/Category');

module.exports = {
    addCategory : async (req,res) =>{
        const {name} = req.body; 
        const category = new Category({
            name : name
        });
        try {
            await category.save();
            res.json({
                msg : "success"
            });
        } catch (error) {
            console.log(error.errors.name.properties.message);
            res.json({
                error : error.message
            })
        }
    }
}