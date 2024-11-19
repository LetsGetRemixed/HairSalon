const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventoryModel');
const { getStorage } = require("firebase-admin/storage");


exports.getInventoryByCategoey = async (req, res) => {
    const category = req.params.category;
    console.log(category);
    try {
        const products = await Inventory.find({ category: category });
        const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
        const [files] = await bucket.getFiles({ prefix: `${category}/` });
        // Filter and generate signed URLs for .tif or .tiff files
         // Filter and map images to product names
    // Filter and map images to product names
    const imagesByProduct = {};

    await Promise.all(
      files
        .filter(file => file.name.match(/\.(tif|tiff)$/i)) // Only include .tif/.tiff files
        .map(async (file) => {
          const fileName = file.name.split('/').pop(); // Extract file name
          const productName = fileName.replace(/\.(tif|tiff)$/i, ''); // Assume the product name is in the file name, e.g., 'productName_variant.tif'

          // Generate signed URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2500',
          });

          // Group URLs by product name
          if (!imagesByProduct[productName]) {
            imagesByProduct[productName] = [];
          }
          imagesByProduct[productName].push(url);
        })
    );

    // Convert imagesByProduct to an array format for easier frontend consumption
    const result = Object.entries(imagesByProduct).map(([productName, images]) => ({
      productName,
      images,
    }));
    //console.log(result);
    const inventoryItems = await Inventory.find();
    const updatedProducts = [];
    await Promise.all(
        products.map(async (item) => {
            const matchingProduct = result.find(r => r.productName === item.productName);
            //console.log('here:', matchingProduct);
            if (matchingProduct) {
                 // Update with image URLs
                item.imageUrl = matchingProduct.images[0];
                await item.save(); // Save updated product
                console.log(matchingProduct.images);
                updatedProducts.push(item);
            }
        })
    );
      res.json(updatedProducts);
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
    const { category, productName, variants, imageUrl } = req.body;
    console.log("Image url is", imageUrl);
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


