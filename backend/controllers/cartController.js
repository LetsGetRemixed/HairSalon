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
  
  // Check if the userId is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  
  const { productId, length, quantity } = req.body;

  // Validate that all required fields are present
  if (!productId || !length || quantity == null) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate that the productId is a valid MongoDB ObjectId
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, cart: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.cart.find(
      (item) => item.productId.toString() === productId && item.length === length
    );

    if (existingItem) {
      // Update the quantity if item already exists
      existingItem.quantity += quantity;
    } else {
      // Add a new item to the cart
      cart.cart.push({ productId, length, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart: cart.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
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
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    

    cart.cart = cart.cart.filter((item) => item.productId.toString() !== productId);
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

// Update Quantity in Cart
exports.updateCartItemQuantity = async (req, res) => {
  const { userId } = req.params;
  const { productId, newQuantity } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  if (!mongoose.isValidObjectId(productId) || newQuantity == null) {
    return res.status(400).json({ message: 'Missing product ID or new quantity' });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.cart.find((item) => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = newQuantity;
    await cart.save();

    res.status(200).json({ message: 'Quantity updated successfully', cart: cart.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



