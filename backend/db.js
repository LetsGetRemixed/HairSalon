const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI; // Connection string
console.log(uri);

const connectToDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch (error){
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = connectToDB;