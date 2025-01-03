const mongoose = require('mongoose');
const cron = require('node-cron');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}

// Create Membership or Reactivate an old membership
exports.createMembership = async (req, res) => {
  const { userId } = req.params;
  const { subscriptionId, customerId, subscriptionType, membershipType } = req.body;
  
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
      let now = new Date();
      if (currentSubscription.expireDate > now) {
        return res.status(200).json({ message: `User already has a active running subscription, expires on ${currentSubscription.expireDate}`, subscription: currentSubscription });
      } else {
        // If the membership is not active, update it
        currentSubscription.membershipType = membershipType;
        currentSubscription.subscriptionId = subscriptionId;
        currentSubscription.customerId = customerId;
        currentSubscription.subscriptionType = subscriptionType;
        currentSubscription.isActive = true;
        currentSubscription.nextBillDate = new Date();
        await currentSubscription.save();

        return res.status(200).json({
          message: 'Membership renewed successfully!',
          subscription: currentSubscription,
        });
      }
    }

    const newSubscription = new Subscription({
      user: userId,
      membershipType: membershipType,
      subscriptionId: subscriptionId,
      customerId: customerId,
      subscriptionType: subscriptionType,
      isActive: true,
      nextBillDate: new Date(),
    });

    await newSubscription.save();

    user.subscription = newSubscription._id;
    await user.save();

    return res.status(201).json({ message: 'Subscription created successfully!', subscription: newSubscription });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createStylistMembership = async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
     } 
     const newSubscription = new Subscription({
      user: userId,
      membershipType: 'Stylist',
      isActive: true,
    });

    await newSubscription.save();
    user.subscription = newSubscription._id;
    await user.save();

    return res.status(201).json({ message: 'Stylist subscription created successfully!', subscription: newSubscription });
  } catch (error) {
    console.log('Error is', error);
    return res.status(500).json({ message: error.message });
  }
}

// Return the membership type for a user
exports.getSubscriptionByUserId = async (req, res) => {
  const { userId } = req.params;
  
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
     } 

    const subscription = await Subscription.findOne({ user: userId });
    if (!subscription) {
      return res.status(200).json('Default');
    }
    res.status(200).json(subscription.membershipType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscriptions", error });
  }
}

// Cancel a subscription and set a expiration date at the end of a billing period
exports.cancelSubscription = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findById(userId).populate('subscription'); 
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

// Update the membership type for a user
exports.updateSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;
  const { membershipType } = req.body;
  
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).populate('subscription'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscription = user.subscription;
    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found for user' });
    }
    subscription.membershipType = membershipType;
    await subscription.save();
    res.status(200).json({
      message: 'Subscription membershipType updated',
      subscription,
    });

  } catch (error) {
    console.error('Error checking subscriptions subscription:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update all of the expired subscriptions to Styilst 
exports.checkAndUpdateExpiredSubscription = async (req, res) => {
  try {
    const now = new Date();
    const expiredSubscriptions = await Subscription.find({ 
      expireDate: { $lt: now }, 
      isActive: true 
    });
    console.log(expiredSubscriptions);

    // Check all active subscriptions
    for (const subscription of expiredSubscriptions) {
      subscription.membershipType = 'Stylist';
      subscription.isActive = true;
      await subscription.save();
      console.log(`Updated subscription ${subscription._id} to inactive.`);
    }
    res.json({ message: 'Subscriptions that are expired are now set to false' });
  } catch (error) {
    console.error('Error checking subscriptions subscription:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.upgradeMembership = async (req, res) => {
  const { userId } = req.params;
  const { newPriceId } = req.body;
  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  let interval;
  if (newPriceId == 'price_1QZ1mNEnsP1F5DSTCOjT0COa') { 
    interval = 'Yearly';
  } else if (newPriceId == 'price_1QZ1m1EnsP1F5DSTluEMGzzh') {
    interval = 'Monthly';
  } else {
    res.status(401).json({ message: 'Need a valid priceId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let currentSubscription = await Subscription.findOne({ user: userId }); 
    if (!currentSubscription) {
      return res.status(404).json({ message: 'No active subscription found for user' });
    }
    // Retrieve the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(currentSubscription.subscriptionId);
    if (!subscription) {
      return res.status(400).json({ message: 'No subscription found.' });
    }

    // Cancel the current subscription at the end of the cycle
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    // Schedule the new subscription to start at the end of the current cycle
    const newSubscription = await stripe.subscriptions.create({
      customer: subscription.customer,
      items: [{ price: newPriceId }],
      proration_behavior: 'none', // Avoid immediate charges
      billing_cycle_anchor: subscription.current_period_end,
      metadata: {
        originalSubscription: subscription.id,
      },
    });
    currentSubscription.subscriptionId = newSubscription.id;
    currentSubscription.expireDateForInterval = new Date(subscription.current_period_end * 1000);
    res.status(200).json({
      message: 'Subscription updated successfully',
      subscription: newSubscription,
    });
    

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to calculate the next billing date
// We will call this function for every subscription thats billing date has past and update it
function calculateNextBillingDate(currentDate, subscriptionType) {
  const nextDate = new Date(currentDate);
  if (subscriptionType === 'Monthly') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  } else if (subscriptionType === 'Yearly') {
    nextDate.setFullYear(nextDate.getFullYear() + 1);
  }
  return nextDate;
}

// Scheduled job to run every day at midnight
cron.schedule('0 0 * * *', async () => {

  try {
    // Fetch all subscriptions that are past their next billing date
    const now = new Date();
    const subscriptions = await Subscription.find({ nextBillDate: { $lte: now } });

    // For every subscription in past due billing subscriptions
    for (const subscription of subscriptions) {
      const { subscriptionType, nextBillDate } = subscription;
      // Calculate the new billing date
      const updatedBillDate = calculateNextBillingDate(nextBillDate, subscriptionType);
      // Update the subscription
      subscription.nextBillDate = updatedBillDate;
      await subscription.save();
    }
    console.log('Daily subscription check completed.');
  } catch (error) {
    console.error('Error during daily subscription check:', error);
  }
});