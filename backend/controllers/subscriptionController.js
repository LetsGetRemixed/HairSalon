const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// Create Membership
exports.createMembership = async (req, res) => {
    const { userId } = req.params;
    const { membershipType } = req.body;
    console.log('Creating membership type', membershipType);

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      console.log('Username is: ', user.name);

      const currentSubscription = await Subscription.findOne({ user: userId });
      if (currentSubscription) {
        console.log('User already has a membership. Extend the mebership');
        return res.status(500).json({ message: 'User already created membership' });
      } else {
        console.log('Creating subscription now');
        const newSubscription = new Subscription({
          user: userId,
          membershipType: membershipType,
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // One month from now
          isActive: true
        });
        await newSubscription.save();
        return res.status(200).json({ message: 'Subscription created', subscription: newSubscription});
      }
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

  console.log('This is teh membership type: ', membershipType);
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    console.log('Username is: ', user.name);

    const currentSubscription = await Subscription.findOne({ user: userId });
    // If we dont find a active subscription for the user then we create a new one
    if (!currentSubscription) {
      console.log('Need to create membership');
      return res.status(201).json({ message: 'Create membership first'});
    } else {
      console.log('Extending subscription now');
      if (!currentSubscription.isActive) {
        console.log('They had a non-active membership');
          currentSubscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          currentSubscription.isActive = true;
      } else {
        console.log('They already had a actiev membership');
          // User already has a membership so extend membership by one month
          currentSubscription.expiresAt = new Date(currentSubscription.expiresAt.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
      currentSubscription.membershipType = membershipType;
      await currentSubscription.save();

      return res.status(200).json({ message: 'Subscription extended', subscription: currentSubscription });
    }
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
