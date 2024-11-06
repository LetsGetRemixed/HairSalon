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
    const { productName, category, variants, recommendedNames } = req.body;
    try {
        const newItem = new Inventory({
            productName,
            category,
            variants,        
            recommendedNames 
        });
        await newItem.save();
        res.status(201).send('Item added successfully');
    } catch (error) {
        res.status(400).send('Error adding item: ' + error.message);
    }
};


