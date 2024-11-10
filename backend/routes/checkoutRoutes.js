const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/checkout-session', checkoutController.createCheckout);
module.exports = router;