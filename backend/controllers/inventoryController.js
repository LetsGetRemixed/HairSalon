const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventoryModel');
const { getStorage } = require("firebase-admin/storage");
const multer = require('multer');
const sharp = require('sharp');

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


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

exports.updateInventory = async (req, res) => {
    const { inventoryId } = req.params; // Get inventory ID from URL params
    const updateFields = req.body; // Get the fields to be updated from the request body
    console.log('Body is', updateFields);
    // Validate that at least one field is provided
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }
  
    try {
      const inventoryItem = await Inventory.findById(inventoryId);
  
      if (!inventoryItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
  
      // Update variants only if provided
    if (updateFields.variants) {
        updateFields.variants.forEach((updatedVariant) => {
          const variant = inventoryItem.variants.find(v => v._id.toString() === updatedVariant._id);
          if (variant) {
            if (updatedVariant.length !== undefined) variant.length = updatedVariant.length;
            if (updatedVariant.weftsPerPack !== undefined) variant.weftsPerPack = updatedVariant.weftsPerPack
            if (updatedVariant.prices) {
              if (updatedVariant.prices.suggestedRetailPrice !== undefined) {
                  variant.prices.suggestedRetailPrice = updatedVariant.prices.suggestedRetailPrice;
                }
              if (updatedVariant.prices.ambassadorPrice !== undefined) {
                  variant.prices.ambassadorPrice = updatedVariant.prices.ambassadorPrice;
                }
              if (updatedVariant.prices.stylistPrice !== undefined) {
                  variant.prices.stylistPrice = updatedVariant.prices.stylistPrice;
                }
            }
            if (updatedVariant.quantity !== undefined) variant.quantity = updatedVariant.quantity;
          }
          
        });
      }
  
      // Update other fields 
      Object.keys(updateFields).forEach(key => {
        if (key !== "variants") {
          inventoryItem[key] = updateFields[key];
        }
      });
      
      const updatedInventory = await inventoryItem.save();
  
      return res.status(200).json(updatedInventory);
    } catch (error) {
      console.error("Error updating inventory:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  };

  
  exports.addProduct = async (req, res) => {
    try {
      const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
      const { category, productName, description, weight, variants } = req.body;
  
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required.' });
      }
      console.log('oiwnowxwexwe',req.file);
      const file = req.file;
      
      // Convert file to .webp format
      const convertedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
  
      // Define the file path in Firebase
      const filePath = `${category}/${productName}.webp`;
      console.log('Filepath is ', filePath);
  
      // Upload the .webp file to Firebase
      const fileRef = bucket.file(filePath);
      await fileRef.save(convertedBuffer, {
        metadata: { contentType: 'image/webp' },
      });
  
      // Generate a signed URL for the uploaded image
      const [signedUrl] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2030',
      });
  
      // Save product details to the database
      const product = new Inventory({
        category,
        productName,
        productFileName: productName, 
        description,
        weight,
        imageUrl: signedUrl,
        variants: JSON.parse(variants), 
      });
  
      await product.save();
  
      res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  };

  exports.deleteItem = async (req, res) => {
    try {
      const itemToDelete = Inventory.findByIdAndDelete(req.params.id);
      console.log('Hitting this route ', req.params.id);
      //console.log('Item to be deleteed is ', itemToDelete);
      if (!itemToDelete) return res.status(404).json({ message: 'Item not found' });
      
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.log('We got an error', error.message);
      res.status(500).json({ message: error.message });
    }
  }

