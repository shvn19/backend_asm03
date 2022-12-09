const express = require('express');
const userController = require('../controllers/users');
const authMiddleware = require('../middlewares/auth.middleware');
const isAuth = authMiddleware.isAuth;
const authController = require('../controllers/auths');

const router = express.Router();

router.post('/signup', userController.signup);

router.get('/profile', isAuth, async (req, res) => {
	res.send(req.user);
});

router.post('/refresh', authController.refreshToken);

router.get('/:id', userController.getUserDetail);

module.exports = router;

