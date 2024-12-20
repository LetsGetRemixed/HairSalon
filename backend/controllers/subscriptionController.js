const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

exports.getAllSubscriptions = async (req, res) => {
  try {
    //const subscriptions = await Subscription.find();
    const subscriptions = await Subscription.find().populate('user', 'name email');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}

// Create Membership
exports.createMembership = async (req, res) => {
  const { userId } = req.params;
  const { membershipType, monthsToExtend = 1 } = req.body;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let currentSubscription = await Subscription.findOne({ user: userId });

    if (currentSubscription) {
      return res.status(200).json({ message: 'User already has a membership or had one', subscription: currentSubscription });
    }

    const newSubscription = new Subscription({
      user: userId,
      membershipType,
      startDate: new Date(),
      expiresAt: new Date(new Date().setMonth(new Date().getMonth() + monthsToExtend)),
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
  const { membershipType, monthsToExtend = 1 } = req.body;

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

    const baseDate = currentSubscription.expiresAt > new Date()
        ? new Date(currentSubscription.expiresAt)
        : new Date();

    // Handle upgrading or reactivating a subscription
    if (currentSubscription.membershipType === membershipType) {
      currentSubscription.expiresAt = new Date(baseDate.setMonth(baseDate.getMonth() + monthsToExtend));
    } else {
      // Update the subscription 
      currentSubscription.membershipType = membershipType;
      currentSubscription.isActive = true;
      currentSubscription.expiresAt = new Date(baseDate.setMonth(baseDate.getMonth() + monthsToExtend));
    }

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

exports.checkAndUpdateSubscription = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      return res.status(200).json({ message: 'No active subscription. Defaulting to Bronze.' });
    }

    if (subscription.membershipType === 'Bronze') {
      return res.status(200).json({ message: 'Membership is already Bronze', subscription });
    }

    // Check if the subscription has expired
    if (new Date(subscription.expiresAt) <= new Date()) {
      // Update to Bronze subscription
      subscription.membershipType = 'Bronze';
      subscription.expiresAt = null; 
      subscription.isActive = false;
      await subscription.save();

      return res.status(200).json({ 
        message: 'Subscription expired. Downgraded to Bronze.', 
        subscription 
      });
    }

    // If subscription is still active
    return res.status(200).json({ 
      message: 'Subscription is still active.', 
      subscription 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking subscription', error });
  }
};
