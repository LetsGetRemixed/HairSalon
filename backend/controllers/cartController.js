const User = require('../models/userModel');

// Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { id, name, length, imageUrl, price } = req.body;

    // Check if item already exists in the cart
    const existingItem = user.cart.find((item) => item.id === id && item.length === length);

    if (existingItem) {
      // Increase the quantity if the item exists
      existingItem.quantity += 1;
    } else {
      // Add new item to the cart
      user.cart.push({ id, name, length, imageUrl, price });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { itemId } = req.body;
    user.cart = user.cart.filter((item) => item.id !== itemId);
    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
