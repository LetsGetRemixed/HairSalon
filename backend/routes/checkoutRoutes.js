const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/checkout-session', checkoutController.createCheckout);
router.post('/create-subscription', checkoutController.createDynamicSubscription);
module.exports = router;