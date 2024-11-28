const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true }
    },
    phone: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;