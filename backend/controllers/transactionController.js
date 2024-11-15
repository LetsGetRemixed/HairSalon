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
