const router = require('express').Router();
const ProductController = require('../controllers/Product');
const multer = require('multer');
const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null,'./uploads/')
    },
    filename : function (req, file, cb) {
        cb(null,file.originalname)
    }
})

const upload = multer({storage : storage});


router.post('/', upload.single('productImage'),ProductController.addProduct);

router.get('/', ProductController.getProduct);

router.get('/:id',ProductController.viewProduct);

router.put('/:id',ProductController.updateProduct);

router.delete('/:id', ProductController.deleteProduct);

module.exports = router