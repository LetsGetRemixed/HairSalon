const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');


// Create a new user
exports.createUser = async (req, res) => {
    try {
      console.log("Hey man", req.body);
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

  