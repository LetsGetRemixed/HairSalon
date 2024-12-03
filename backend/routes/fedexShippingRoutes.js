const express = require('express');
const router = express.Router();
const fedExController = require('../controllers/fedexController');

router.post('/get-shipping', fedExController.calculateShippingCost);
module.exports = router;