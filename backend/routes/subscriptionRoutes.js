const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to create or extend a membership
router.post('/create-membership/:userId', subscriptionController.createMembership);
router.put('/update-membership/:userId', subscriptionController.updateMembership);
router.get('/check-user-subscription/:userId', subscriptionController.getSubscriptionByUserId);
router.get('/get-all-subscriptions', subscriptionController.getAllSubscriptions);
router.patch('/cancel-subscription/:subscriptionId', subscriptionController.cancelSubscription);
module.exports = router;