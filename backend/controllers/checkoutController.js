const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.createCheckout = async (req, res) => {
  try {
      const { amount, currency } = req.body;  // Retrieve amount and currency from request
      //console.log('amount is', amount);

      // Create a Payment Intent with the specified amount and currency
      const amountInCents = Math.round(amount);
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents, // amount in cents
          currency: currency,
          metadata: {
              description: "Custom checkout purchase"
          }
      });

      // Send the client_secret back to the frontend
      res.status(200).json({
          clientSecret: paymentIntent.client_secret
      });
  } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Payment creation failed" });
  }
};

exports.createDynamicSubscription = async (req, res) => { 
 const { paymentMethodId, interval } = req.body; 
  try {
    let priceId; 
    if (interval == 'Yearly') {
      priceId = 'price_1QZ1mNEnsP1F5DSTCOjT0COa';
    } else {
      // Monthly price ID
      priceId = price_1QZ1m1EnsP1F5DSTluEMGzzh;
    }
    // Create the customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    res.status(200).json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
  };
