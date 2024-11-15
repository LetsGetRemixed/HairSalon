const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.createCheckout = async (req, res) => {
  try {
      const { amount, currency } = req.body;  // Retrieve amount and currency from request

      // Create a Payment Intent with the specified amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // amount in cents
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
