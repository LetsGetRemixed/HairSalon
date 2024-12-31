const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionsModel');
const { getStorage } = require("firebase-admin/storage");
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');


// Create a new user
exports.createUser = async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).send('User added successfully');
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
};


// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);//.populate('subscription'); 
      

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
  }
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }
      
      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid credentials." });
    }

      res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
  }
  }

  exports.updateUser = async (req, res) => {
    const { userId } = req.params; 
    const updateFields = req.body; 
  
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }
  
    try {
      const user = await User.findById(userId); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Check if the address is part of the fields to update
      if (updateFields.address) {
        const { street, city, state, zip } = updateFields.address;
        if (street) user.address.street = street;
        if (city) user.address.city = city;
        if (state) user.address.state = state;
        if (zip) user.address.zip = zip;
      }

      // Update other fields in the user document
      Object.keys(updateFields).forEach(key => {
        if (key !== 'address' && user[key] !== undefined) { // Prevent overriding the entire address
          user[key] = updateFields[key];
        }
      });
  
      const updatedUser = await user.save(); 
      return res.status(200).json(updatedUser); 
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Server error", error });
    }
  };

  exports.uploadLicense = async (req, res) => {
    try {
      const { userId } = req.params; 
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
      if (!req.file) {
        return res.status(400).json({ error: 'Image is required.' });
      }
      const file = req.file;
      const convertedBuffer = await sharp(file.buffer).webp({ quality: 70 }).toBuffer();

      // Set file name as the user name
      const filePath = `UserLicense/${user.name}.webp`;
      // Upload file to Firebase 
      const fileRef = bucket.file(filePath);
      await fileRef.save(convertedBuffer, {
        metadata: { contentType: 'image/webp' },
      });

      res.status(201).json({ message: 'User license uploaded succesfully to firebase' });
    } catch (error) {
      console.error('Error uploading license:', error);
      res.status(500).json({ error: 'Failed to upload license' });
    }
  };

  exports.getLicenseSignedUrl = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate file path for the user's license
      const filePath = `UserLicense/${user.name}.webp`; 
      const bucket = getStorage().bucket('boldhair-f5522.firebasestorage.app');
      const fileRef = bucket.file(filePath);
  
      // Check if file exists
      const [exists] = await fileRef.exists();
      if (!exists) {
        return res.status(404).json({ message: 'License file not found' });
      }
  
      // Generate a signed URL
      const [url] = await fileRef.getSignedUrl({
        action: 'read', 
        expires: Date.now() + 60 * 60 * 1000, 
      });
  
      res.status(200).json({ signedUrl: url });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      res.status(500).json({ error: 'Failed to generate signed URL' });
    }
  };