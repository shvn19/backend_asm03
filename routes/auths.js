const express = require('express');

const authController = require('../controllers/auths');

const router = express.Router();

router.post('/login', authController.login);

router.post('/refresh', authController.refreshToken);

module.exports = router;