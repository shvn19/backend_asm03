const express = require('express');
const router = express.Router();
const historiesController = require('../controllers/histories');

router.get('', historiesController.getUserHistory);

module.exports = router;