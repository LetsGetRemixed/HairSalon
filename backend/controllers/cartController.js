const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// Get Cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ message: 'Cart is empty', cart: [] });
    res.status(200).json(cart.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const { name, length, price, imageUrl, quantity } = req.body;
  
    if (!name || !length || !price || !imageUrl || quantity == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = new Cart({ user: userId, cart: [] });
      }
      const existingItem = cart.cart.find(
        (item) => item.name === name && item.length === length
      );
  
      if (existingItem) {
        existingItem.quantity += quantity; 
      } else {
        cart.cart.push({ name, length, price, imageUrl, quantity }); 
      }
  
      await cart.save();
      res.status(200).json({ message: 'Cart updated successfully', cart: cart.cart });
    } catch (error) {
      console.error('Error adding to cart:', error); // Log the error to get more details
      res.status(500).json({ message: 'Internal Server Error', error });
    }
  };
  

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  if (!productId) {
    return res.status(400).json({ message: 'Missing product ID' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.cart = cart.cart.filter((item) => item._id.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart: cart.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.cart = []; 
    await cart.save();
    res.status(200).json({ message: 'Cart cleared', cart: cart.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

