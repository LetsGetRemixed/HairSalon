const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membershipType: {
        type: String,
        enum: ['Default', 'Ambassador', 'Stylist'],
        required: true,
      },
      subscriptionId: { type: String },
      customerId: { type: String },
      subscriptionType: {type: String },
      isActive: { type: Boolean, default: true, required: true },
      expireDate: { type: Date, index: true }, 
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;