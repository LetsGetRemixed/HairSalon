const mongoose = require('mongoose');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
  const { subscriptionId, subscriptionType, membershipType } = req.body;
  console.log(req.body);
  
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
      membershipType: membershipType,
      subscriptionId: subscriptionId,
      subscriptionType: subscriptionType,
      isActive: true,
    });

    await newSubscription.save();

    user.subscription = newSubscription._id;
    await user.save();

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


exports.cancelSubscription = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findById(userId).populate('subscription'); // Populate subscription
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = user.subscription;
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found for user' });
    }
    // Cancel the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true,
    });
    
    const currentPeriodEnd = new Date(updatedSubscription.current_period_end * 1000);
    subscription.expireDate = currentPeriodEnd;
    await subscription.save();

    res.status(200).json({
      message: 'Subscription will cancel at the end of the current billing period',
      updatedSubscription,
      subscription,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.checkAndUpdateSubscription = async (req, res) => {
  try {
    const now = new Date();
    const expiredSubscriptions = await Subscription.find({ 
      expireDate: { $lt: now }, 
      isActive: true 
    });
    console.log(expiredSubscriptions);

    // Check all active subscriptions
    for (const subscription of expiredSubscriptions) {
      subscription.isActive = false;
      await subscription.save();
      console.log(`Updated subscription ${subscription._id} to inactive.`);
    }
    res.json({ message: 'Subscriptions that are expired are now set to false' });
  } catch (error) {
    console.error('Error checking subscriptions subscription:', error);
    res.status(500).json({ error: error.message });
  }
};
