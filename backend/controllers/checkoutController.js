const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.createCheckout = async (req, res) => {
  try {
      const { amount, currency } = req.body;  
      // Create a Payment Intent with the specified amount and currency
      const amountInCents = Math.round(amount);
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents, // amount in cents
          currency: currency,
          metadata: {
              description: "Custom checkout purchase"
          }
      });

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
 console.log('Am i hitting here');
  try {
    let priceId; 
    if (interval == 'Yearly') {
      priceId = 'price_1QZ1mNEnsP1F5DSTCOjT0COa';
    } else if (interval == 'Monthly') {
      priceId = 'price_1QZ1m1EnsP1F5DSTluEMGzzh';
    } else {
      res.status(401).json({ message: 'Need a valid interval' });
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

    res.status(200).json({ subscriptionId: subscription.id, customerId: customer.id });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: error.message });
  }
  };
