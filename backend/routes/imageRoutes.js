const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/all-images', imageController.getImages);
router.get('/:category', imageController.getCategory);
module.exports = router;