const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/save-transaction', transactionController.createTransaction);
router.get('/transactions', transactionController.getAllTransactions);
module.exports = router;