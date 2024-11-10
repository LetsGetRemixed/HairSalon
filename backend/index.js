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
const serviceAccount = require('./boldhair-f5522-firebase-adminsdk-t8f6n-9f1cbfe22e.json');

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