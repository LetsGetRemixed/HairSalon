const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get Cart
router.get('/get-cart/:userId', cartController.getCart);

// Add to Cart
router.post('/add-to-cart/:userId', cartController.addToCart);

// Remove from Cart
router.delete('/remove-from-cart/:userId', cartController.removeFromCart);

// Clear Cart
router.delete('/clear-cart/:userId', cartController.clearCart);

// Update Quantity in Cart
router.put('/update-quantity/:userId', cartController.updateCartItemQuantity);

module.exports = router;
