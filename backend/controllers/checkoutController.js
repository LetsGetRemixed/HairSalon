const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckout = async (req, res) => {
    const { cartItems } = req.body;
    if (!cartItems || !cartItems.length) {
        return res.status(400).json({ error: 'Cart is empty' });
      }
    try {
        // Parse the body and convert to an array of items
        const lineItems = cartItems.map(item => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                description: item.description || '', 
                tax_code: item.taxCode // Using item.taxCode here
              },
              unit_amount: item.amount, // Amount in cents
            },
            quantity: item.quantity,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
              mode: 'payment',
              automatic_tax: { enabled: true },
              success_url: `http://localhost:5100/success`,  // Temp
              cancel_url: `http://localhost:5100/cancel`,    // Temp
        });
        const taxAmount = session.total_details.amount_tax;
        console.log("Calculated Tax Amount:", taxAmount);
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).send({ error: error.message });
      }
};
