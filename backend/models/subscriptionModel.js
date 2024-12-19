const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membershipType: {
        type: String,
        enum: ['Default', 'Ambassador', 'Stylist'],
        required: true,
      },
      subscriptionId: { type: String, required: true },
      subscriptionType: {type: String, required: true},
      isActive: { type: Boolean, required: true }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;