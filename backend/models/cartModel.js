const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    cart: [
        {
          name: { type: String, required: true },
          length: { type: String, required: true },
          price: { type: Number, required: true },
          imageUrl: { type: String, required: true },
          quantity: { type: Number, default: 1 },
        },
      ],
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;