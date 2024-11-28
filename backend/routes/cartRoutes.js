const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get Cart
router.get('/:userId', cartController.getCart);

// Add to Cart
router.post('/:userId', cartController.addToCart);

// Remove from Cart
router.delete('/:userId', cartController.removeFromCart);

// Clear Cart
router.delete('/:userId/clear', cartController.clearCart);

module.exports = router;
