const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// Create Membership
exports.createMembership = async (req, res) => {
  const { userId } = req.params;
  const { membershipType } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let currentSubscription = await Subscription.findOne({ user: userId });

    // If the user has an existing subscription (even inactive), handle it
    if (currentSubscription) {
      if (currentSubscription.membershipType === membershipType) {
        return res.status(400).json({ message: 'You already have this membership.' });
      }

      // Reactivate or upgrade the existing subscription
      currentSubscription.membershipType = membershipType;
      currentSubscription.isActive = true;
      currentSubscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // One month from now
      await currentSubscription.save();

      return res.status(200).json({
        message: 'Subscription upgraded successfully!',
        subscription: currentSubscription,
      });
    }

    // Otherwise, create a new subscription
    const newSubscription = new Subscription({
      user: userId,
      membershipType,
      startDate: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // One month from now
      isActive: true,
    });

    await newSubscription.save();

    return res.status(201).json({ message: 'Subscription created successfully!', subscription: newSubscription });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Update membership
exports.updateMembership = async (req, res) => {
  const { userId } = req.params;
  const { membershipType } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentSubscription = await Subscription.findOne({ user: userId });

    // Handle no existing subscription
    if (!currentSubscription) {
      return res.status(404).json({ message: 'No active subscription found. Please create one first.' });
    }

    // Handle upgrading or reactivating a subscription
    if (currentSubscription.membershipType === membershipType) {
      return res.status(400).json({ message: 'You already have this membership.' });
    }

    currentSubscription.membershipType = membershipType;
    currentSubscription.isActive = true;
    currentSubscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Extend by one month

    await currentSubscription.save();

    return res.status(200).json({
      message: 'Subscription updated successfully!',
      subscription: currentSubscription,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



exports.getSubscriptionByUserId = async (req, res) => {
  const { userId } = req.params;
  
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('Not found');
      return res.status(404).json({ message: 'User not found' });
     } else {
      console.log('User found');
     }

    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      return res.status(200).json('Bronze');
    }
    res.status(200).json(subscription.membershipType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions", error });
  }
}