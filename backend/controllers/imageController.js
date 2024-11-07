const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();
const { getStorage, getDownloadURL } = require("firebase-admin/storage");



exports.getImages = async (req, res) => {
    console.log('Calling image fcuntion');
  
    try {
      const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
      // Add this inside getFiles() later { prefix: `${category}/` }
      const [files] = await bucket.getFiles();
  
      // Generate public URLs for each file in the category
      const urls = files.map(file => file.publicUrl());
      res.json({ images: urls });
    } catch (error) {
      res.status(500).send('Error fetching images: ' + error.message);
    }
  };