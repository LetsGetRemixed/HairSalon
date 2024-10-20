const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membershipType: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold'],
        required: true,
      },
      startDate: { type: Date, default: Date.now },
      expiresAt: { type: Date, required: true },
      isActive: { 
        type: Boolean, 
        default: function() {
          return this.expiresAt > Date.now();
        }
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;