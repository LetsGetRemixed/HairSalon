const Transaction = require('../models/transactionsModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');


exports.createTransaction = async (req, res) => {
    try {
        const { products, buyerId, shippingAddress, totalAmount, priority } = req.body;
        
        
        if (!products || !buyerId || !shippingAddress || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const buyerObjectId = new mongoose.Types.ObjectId(buyerId);

        // Verify user
        const user = await User.findById(buyerId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add transaction record
        const transaction = new Transaction({
            products,
            buyerId: buyerObjectId,
            shippingAddress,
            totalAmount,
            priority,
        });
        const savedTransaction = await transaction.save();
        res.status(201).json({ message: 'Transaction saved successfully', transaction: savedTransaction });
    } catch (error) {
        console.error('Error saving transaction:', error);
        res.status(500).json({ message: 'Failed to save transaction', error: error.message });
    }
}

// Fetch all transactions, optionally filter by date range
exports.getAllTransactions = async (req, res) => {
    try {
        const { startDate, endDate, buyerId } = req.query;
        

        let query = {};
        if (startDate || endDate) {
            query.purchaseDate = {};
            if (startDate) {
                query.purchaseDate.$gte = new Date(startDate); 
            }
            if (endDate) {
                query.purchaseDate.$lte = new Date(endDate); 
            }
        }

        // Filter by buyer's email if provided
        if (buyerId) {
            query.buyerId = buyerId;
        }

        const transactions = await Transaction.find(query).populate('buyerId', 'name email');
        console.log('Here is the transaction', transactions);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};

exports.updateTransaction = async (req, res) => {
    const { transactionId } = req.params; // The transaction ID from the request params
  
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
  
      // Toggle isShipped status
      transaction.isShipped = !transaction.isShipped;
      await transaction.save();
  
      res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ message: 'Failed to update transaction', error: error.message });
    }
  };