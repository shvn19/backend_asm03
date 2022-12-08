const express = require('express');
const productController = require('../controllers/products');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:_id', productController.getOneProduct);

module.exports = router;