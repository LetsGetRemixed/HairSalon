const Transaction = require('../models/transactionsModel');


exports.createTransaction = async (req, res) => {
    try {
        console.log('BODY: ', req.body);
        const { products, buyer, shippingAddress, quantity, totalAmount } = req.body;
        
        if (!products || !buyer || !shippingAddress || !quantity || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Add transaction record
        const transaction = new Transaction({
            products,
            buyer,
            shippingAddress,
            quantity,
            totalAmount
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
        const { startDate, endDate } = req.query;

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

        const transactions = await Transaction.find(query);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
};