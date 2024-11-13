const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const dotenv = require('dotenv');

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

dotenv.config();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
//const serviceAccount = require('./boldhair-f5522-firebase-adminsdk-t8f6n-9f1cbfe22e.json');
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FB_TYPE,
    project_id: process.env.FB_PROJECT_ID,
    private_key_id: process.env.FB_PRIVATE_KEY_ID,
    private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace `FIREBASE_` prefix with `FB_`
    client_email: process.env.FB_CLIENT_EMAIL,
    client_id: process.env.FB_CLIENT_ID,
    auth_uri: process.env.FB_AUTH_URI,
    token_uri: process.env.FB_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
    universe_domain: process.env.FB_UNIVERSE_DOMAIN,
  }),
});



const app = express();
app.post('/api/checkout-session/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  console.log('Calling this function');
  //console.log("Body: ", req.body);
  console.log("sig: ", sig);
  
  
  let event;
  try {
      event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_935b19a8de0b9154a3121d293d4e05b2be6d8323cd37591597ec1de78bb1c4ba');
      console.log('Event: ', event);
  } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log('event type: ',event.type);

  // Handle the event
  if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Access session details here
      const { id, payment_status, customer_details, amount_total, metadata } = session;
      
      // Perform any post-payment operations, e.g., saving details to the database
      // Example: Create a new order or update user's purchase history

      console.log(`Checkout session completed for customer: ${customer_details.email}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});

app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/items', inventoryRoutes);
app.use('/api/images', imageRoutes);
//app.use('/api', webhookRoutes);
app.use('/api/checkout', checkoutRoutes);

// Connect to MongoDB
connectToDB();
exports.api = functions.https.onRequest(app);

// Start the server
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});