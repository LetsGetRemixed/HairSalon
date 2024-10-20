const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');

// Create Membership
exports.createMembership = async (req, res) => {
    const { userId } = req.params;
    const { membershipType } = req.body;
    console.log('This is teh membership type: ', membershipType);
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const currentSubscription = await Subscription.findOne({ user: userId });
      // If we dont ind a active subscription for the user then we create a new one
      if (!currentSubscription) {
        console.log('Creating a new subscription now');
        const newSubscription = new Subscription({
          user: userId,
          membershipType: membershipType,
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // One month from now
          isActive: true
        });
        await newSubscription.save();
        return res.status(201).json({ message: 'Subscription created', subscription: newSubscription });
      } else {
        console.log('Extending subscription now');
        if (!currentSubscription.isActive) {
            currentSubscription.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else {
            // User already has a membership so extend membership by one month
            currentSubscription.expiresAt = new Date(currentSubscription.expiresAt.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
        currentSubscription.membershipType = membershipType;
        currentSubscription.isActive = true;
        await currentSubscription.save();

        return res.status(200).json({ message: 'Subscription extended', subscription: currentSubscription });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };