const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Route to create or extend a membership
router.post('/create-membership/:userId', subscriptionController.createMembership);
router.post('/create-stylist-sub/:userId', subscriptionController.createStylistMembership);
router.get('/check-user-subscription/:userId', subscriptionController.getSubscriptionByUserId);
router.get('/get-all-subscriptions', subscriptionController.getAllSubscriptions);
router.patch('/cancel-subscription/:userId', subscriptionController.cancelSubscription);
router.patch('/update-subscription-status/:userId', subscriptionController.updateSubscriptionStatus);
router.patch('/check-expired-functions', subscriptionController.checkAndUpdateExpiredSubscription);
router.patch('/upgrade-membership/:userId', subscriptionController.upgradeMembership);

module.exports = router;