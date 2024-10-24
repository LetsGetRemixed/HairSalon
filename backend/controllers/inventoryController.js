const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');

// Get all inventory
exports.getAllInventory = async (req, res) => {
    const { category } = req.query; 
    try {
        let items;
        if (category) {
            // If a category is provided, filter the items by category
            items = await Inventory.find({ category: category });
        } else {
            // If no category is provided, return all items
            items = await Inventory.find();
        }
        res.status(200).json(items);
    } catch (error) {
        res.status(500).send('Error fetching inventory: ' + error.message);
    }
};

// Get a single Item
exports.getOneItem = async (req, res) => {
    try {
        const item = await Inventory.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).send('Error fetching product: ' + error.message);
    }
};


// Add a new item to the inventory
exports.addItem = async (req, res) => {
    const { itemName, category, quantity, price, dimensions, features, image, description } = req.body;
    
    try {
        const newItem = new Inventory({
            itemName,
            category,
            quantity,
            price,
            dimensions,
            features,    
            image,       
            description  
        });

        // Save the new item to the database
        await newItem.save();

        // Send a success response
        res.status(201).send('Item added successfully');
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(400).send('Error adding item: ' + error.message);
    }
};

// Update quantity of an item
exports.updateQuantity = async (req, res) => {
    const { itemName, addedQuantity } = req.body;
    console.log(req.body);
    try {
        const updatedItem = await Inventory.findOneAndUpdate(
            { itemName },
            { $inc: { quantity: addedQuantity } }, // $inc operator increments the quantity
            { new: true } // Return updated item
        );
        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json({ message: 'Quantity updated successfully', updatedItem });
    } catch (error) {
        res.status(400).send('Error updating quantity: ' + error.message);
    }
};

// Update an inventory item
exports.updateInventory = async (req, res) => {
    const { itemId, itemName, category, quantity, price, dimensions, features, image, description } = req.body;
    let updateFields = {};
    if (itemName) updateFields.itemName = itemName;
    if (category) updateFields.category = category;
    if (quantity) updateFields.quantity = quantity;
    if (price) updateFields.price = price;
    if (dimensions) updateFields.dimensions = dimensions;
    if (features) updateFields.features = features;
    if (image) updateFields.image = image;
    if (description) updateFields.description = description;

    try {
        // Only update the fields that are provided in the request
        const updatedItem = await Inventory.findByIdAndUpdate(
            itemId,
            { $set: updateFields }, // Use $set to update only the specified fields
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).send('Item not found');
        }

        res.status(200).json({ message: 'Item updated successfully', updatedItem });
    } catch (error) {
        res.status(400).send('Error updating item: ' + error.message);
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const itemToDelete = await Inventory.findByIdAndDelete(id);
        if (!itemToDelete) {
            return res.status(404).send('Item not found');
        }
        res.status(200).json({ message: 'Item deleted successfully', itemToDelete });
    } catch (error) {
        res.status(400).send('Error deleting item ' + error.message);
    }
};
