const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Blonde', 'Dark', 'Mix'],
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  variants: [
    {
      length: { type: String, required: true }, // 18in, 20in, 22in, 24in
      weftsPerPack: { type: Number, required: true }, // 6 or 5 per pack
      prices: {
        suggestedRetailPrice: { type: Number, required: true },
        ambassadorPrice: { type: Number, required: true },
        stylistPrice: { type: Number, required: true }
      },
      quantity: { type: Number },
    }
  ],
  imageUrl: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('Inventory', inventorySchema);
