const express = require('express');
const mongoose = require('mongoose');
const connectToDB = require('./db');
const userRoutes = require('./routes/userRoutes');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());


// User routes
app.use('/api/Users', userRoutes);

// Connect to MongoDB
connectToDB();

// Start the server
const PORT = 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});