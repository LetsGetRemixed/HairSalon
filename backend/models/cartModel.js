const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    cart: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          length: { type: String, required: true },
          quantity: { type: Number, default: 1 },
        },
      ],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
