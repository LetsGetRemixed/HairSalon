const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventoryModel');
const { getStorage } = require("firebase-admin/storage");


const getInventory = async (category) => {
        const products = await Inventory.find({ category: category });
        const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
        const [files] = await bucket.getFiles({ prefix: `${category}/` });
        const imagesByProduct = {};

        // Add all of the file names into array
        await Promise.all(
        files
            .filter(file => file.name.match(/\.(webp)$/i)) // Only include .tif/.tiff files
            .map(async (file) => {
            const fileName = file.name.split('/').pop(); // Extract file name
            const productFileName = fileName.replace(/\.(webp)$/i, ''); // Assume the product name is in the file name, e.g., 'productName_variant.tif'
            console.log('File name',fileName);
            // Generate signed URL
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2500',
            });

            // Group URLs by product name
            if (!imagesByProduct[productFileName]) {
                imagesByProduct[productFileName] = [];
            }
            imagesByProduct[productFileName].push(url);
            })
        );
        
        // Update the image URLs
        const updatedProducts = [];
        await Promise.all(
            products.map(async (item) => {
                const productFileName = item.productFileName;
                const matchingProduct = imagesByProduct[productFileName];
                if (matchingProduct) {
                    // Update with image URLs
                    item.imageUrl = matchingProduct[0];
                    await item.save(); 
                    updatedProducts.push(item);
                }
            })
        );
      return updatedProducts;
};

exports.getInventoryByCategory = async (req, res) => {
    const category = req.params.category;
    try {
        const updatedProducts = await getInventory(category);
        res.json(updatedProducts);
    } catch (error) {
        res.status(500).send('Error fetching inventory: ' + error.message);
    }
};

exports.getAllInventory = async (req, res) => {
    const categories = ['Blonde', 'Mix', 'Dark']; 
    try {
        const allProducts = await Promise.all(
            categories.map(category => getInventory(category)) // Fetch all categories in parallel
        );
        res.json(allProducts.flat()); // Flatten the result to a single array
    } catch (error) {
        res.status(500).send('Error fetching all inventory: ' + error.message);
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
    const { category, productName, variants, imageUrl } = req.body;
    try {
        const newItem = new Inventory({
            productName,
            category,
            variants,
            imageUrl: imageUrl         
        });
        await newItem.save();
        res.status(201).send('Item added successfully');
    } catch (error) {
        res.status(400).send('Error adding item: ' + error.message);
    }
};


