const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionsModel');



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
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
    console.log("heijbiobde");
  
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