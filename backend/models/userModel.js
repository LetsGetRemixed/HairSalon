const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true }
    },
    membership: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold'],
      default: 'Bronze'
    },
    phone: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    membershipExpiresAt: { type: Date }, 
    isActive: {
        type: Boolean,
        default: function() {
            return this.membership === 'Silver' || this.membership === 'Gold';
        }
    },
    isAdmin: { type: Boolean, default: false }
  });
  
  const User = mongoose.model('User', userSchema);
  module.exports = User;