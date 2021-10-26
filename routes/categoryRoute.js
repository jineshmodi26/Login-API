const router = require('express').Router();
const CategoryController = require('../controllers/Category');

router.post('/',CategoryController.addCategory);

module.exports = router;