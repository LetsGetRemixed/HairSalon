// transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  products: [
    {
      name: { type: String, required: true },
      length: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1},
    }
  ],
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shippingAddress: {
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  isShipped: { type: Boolean, default: false },
  priority: { type: String, enum: ['Ground', '2Day', 'Overnight'] },
});

module.exports = mongoose.model('Transaction', transactionSchema);
