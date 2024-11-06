const express = require('express');
const mongoose = require('mongoose');
const connectToDB = require('./db');
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());


// Routes
app.use('/api/users', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/items', inventoryRoutes);

// Connect to MongoDB
connectToDB();

// Start the server
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});