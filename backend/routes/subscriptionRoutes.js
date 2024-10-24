const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to create or extend a membership
router.post('/create-membership/:userId', subscriptionController.createMembership);
router.put('/update-membership/:userId', subscriptionController.updateMembership);

module.exports = router;