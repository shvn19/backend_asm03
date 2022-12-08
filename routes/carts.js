const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const isAuth = authMiddleware.isAuth;

const cartController = require('../controllers/carts');

router.post('/add', isAuth, cartController.addToCart);

router.get('', isAuth, cartController.getCart);

router.delete('/delete', isAuth,cartController.deleteCart);

module.exports = router;