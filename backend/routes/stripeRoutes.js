const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeController.handleStripeWebhook);
module.exports = router;