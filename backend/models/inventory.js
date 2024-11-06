const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: false },
    price: { type: Number, required: false, default: null },
    description: { type: String, default: "" } 
});


const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;