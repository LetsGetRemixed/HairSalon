const express = require('express');
const router = express.Router();
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_935b19a8de0b9154a3121d293d4e05b2be6d8323cd37591597ec1de78bb1c4ba'; 
  
  try {
    // Verify the webhook signature using the raw body
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    console.log(invoice);
    
    // Get the stripe user ID
    const userId = invoice.customer;
    console.log('userID is ', userId);
    
    try {
      const subscription = await Subscription.findOne({ customerId: userId });
      if (subscription) {
          subscription.membershipType = 'Default';
          subscription.isActive = false; 
          await subscription.save();
          console.log('User subscription updated after failed payment');
      } else {
        console.log('User not foound');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    } 
  }

  res.json({ received: true });
};