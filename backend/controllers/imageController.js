const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();
const { getStorage } = require("firebase-admin/storage");

exports.getImages = async (req, res) => {
  try {
    const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
    const [files] = await bucket.getFiles(); // Get all files in the bucket

    // Generate signed URLs for each file
    const imageUrls = await Promise.all(files.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2500' // Set expiration as needed
      });
      return url;
    }));

    res.json({ images: imageUrls }); // Send URLs to the frontend
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
};

exports.getCategory = async (req, res) => {
  const category = req.params.category;
  console.log(category);
  try {
    const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
    const [files] = await bucket.getFiles({ prefix: `${category}/` }); 

    const imageUrls = await Promise.all(files.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2500' 
      });
      return url;
    }));

    res.json({ images: imageUrls });
  } catch (error) {
    console.error('Error fetching images from category:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
}

  //const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');