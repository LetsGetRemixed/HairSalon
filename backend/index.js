const express = require('express');
const cors = require('cors');
const connectToDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const dotenv = require('dotenv');

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

dotenv.config();
const admin = require('firebase-admin');
const functions = require('firebase-functions');
//const serviceAccount = require('./boldhair-f5522-firebase-adminsdk-t8f6n-9f1cbfe22e.json');
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/items', inventoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/checkout', checkoutRoutes);

// Connect to MongoDB
connectToDB();
exports.api = functions.https.onRequest(app);

// Start the server
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});