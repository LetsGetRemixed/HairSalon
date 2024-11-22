import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from './SubscriptionContext';
import { AuthContext } from '../Account/AuthContext';

const SubscriptionPage = () => {
  const { subscription, setSubscription } = useSubscription();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(subscription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to registration if the user is not logged in
  useEffect(() => {
    if (!user) {
      navigate('/register'); // Redirect to registration page
    }
  }, [user, navigate]);

  const refreshSubscription = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
      );
      setSubscription(response.data || 'Bronze'); // Update context with latest subscription
      setSelectedPlan(response.data || 'Bronze');
    } catch (err) {
      console.error('Error refreshing subscription:', err);
    }
  };

  const handleSubscriptionChange = async () => {
    setLoading(true);
    setError('');
  
    try {
      if (!user) {
        setError('User not logged in');
        return;
      }
  
      if (subscription === 'Bronze') {
        // Call create-membership even for upgrades from Bronze
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/create-membership/${user.userId}`,
          { membershipType: selectedPlan }
        );
        setSubscription(response.data.subscription.membershipType); // Update context immediately
        alert('Subscription created/upgraded successfully!');
      } else {
        // Call update-membership for other upgrades
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/update-membership/${user.userId}`,
          { membershipType: selectedPlan }
        );
        setSubscription(response.data.subscription.membershipType); // Update context immediately
        alert('Subscription updated successfully!');
      }
  
      await refreshSubscription(); // Refresh subscription data
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.response?.data?.message || 'Error processing subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-center">Choose Your Plan</h1>
      {subscription && subscription !== 'Bronze' && (
        <p className="text-green-600 font-medium text-center mb-4">
          Your current plan: <strong>{subscription}</strong>
        </p>
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="grid grid-cols-1 gap-4">
        {['Bronze', 'Silver', 'Gold'].map((plan) => (
          <button
            key={plan}
            onClick={() => setSelectedPlan(plan)}
            className={`p-4 rounded-md border ${
              selectedPlan === plan
                ? 'border-green-500 bg-green-100'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            {plan}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubscriptionChange}
        className={`mt-6 w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 ${
          loading ? 'opacity-50' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Submit Membership'}
      </button>
    </div>
  );
};

export default SubscriptionPage;




