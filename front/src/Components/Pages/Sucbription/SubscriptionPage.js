import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from './SubscriptionContext';
import { AuthContext } from '../Account/AuthContext';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const SubscriptionPage = () => {
  const { subscription, licenseStatus, selectedPlan, selectPlan, refreshSubscription } = useSubscription();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Redirect to registration if the user is not logged in and refresh subscription on page load
  useEffect(() => {
    if (!user) {
      navigate('/register');
    } else {
      refreshSubscription(); // Fetch latest subscription and license status on initial load
    }
  }, [user, navigate]); // Dependency on user and navigate only

  const handleSubscribe = () => {
    if (licenseStatus !== 'Approved') {
      alert('Your license must be approved before subscribing.');
      return;
    }
    if (selectedPlan === subscription) {
      alert('You already have this subscription.');
      return;
    }
    if (selectedPlan === 'Default') {
      alert('You cannot subscribe to the default plan.');
      return;
    }
    navigate(`/subcheckout?plan=${selectedPlan}`);
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/cancel-subscription/${user.userId}`,
        { method: 'PATCH' }
      );
      const data = await response.json();
      if (response.ok) {
        alert('Subscription canceled successfully.');
        refreshSubscription(); // Update context with the latest subscription
      } else {
        throw new Error(data.message || 'Error canceling subscription.');
      }
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError(err.message || 'Error processing cancellation.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadLicense = () => {
    navigate('/license'); // Navigate to license upload page
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Manage Your Subscription</h1>
        {licenseStatus === 'Pending' && (
          <p className="text-yellow-600 font-medium text-center mb-4">
            Your license is pending approval. You cannot subscribe until it's approved.
          </p>
        )}
        {licenseStatus === 'Rejected' && (
          <p className="text-red-600 font-medium text-center mb-4">
            Your license was rejected. Please upload a valid license.
          </p>
        )}
        {licenseStatus === 'Approved' && subscription && subscription !== 'Default' && (
          <p className="text-green-600 font-medium text-center mb-4">
            Your current plan: <strong>{subscription}</strong>
          </p>
        )}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  
        {licenseStatus !== 'Approved' && (
          <button
            onClick={handleUploadLicense}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          >
            Upload License
          </button>
        )}
  
        {licenseStatus === 'Approved' && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[
                {
                  plan: 'Ambassador',
                  price: '$50',
                  description: [
                    'Exclusive access to Ambassador tools.',
                    'Priority customer support.',
                    'Even more discounts on all products!',
                  ],
                },
                {
                  plan: 'Ambassador for 1 Year',
                  price: '$540',
                  savings: 'Save $60 compared to the monthly plan!',
                  description: [
                    'All benefits of the monthly plan.',
                    'Significant savings for a yearly commitment.',
                  ],
                },
              ].map(({ plan, price, savings, description }) => (
                <div
                  key={plan}
                  className={`p-6 rounded-lg border shadow-lg ${
                    subscription === plan
                      ? 'border-gray-400 bg-gray-200 cursor-not-allowed'
                      : selectedPlan === plan
                      ? 'border-green-500 bg-green-100'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                  onClick={() => {
                    if (subscription !== plan) selectPlan(plan);
                  }}
                >
                  <h2 className="text-2xl font-bold mb-2 text-center">{plan}</h2>
                  <p className="text-lg font-semibold text-gray-800 mb-4 text-center">{price}</p>
                  {savings && (
                    <p className="text-sm text-green-600 font-medium mb-4 text-center">{savings}</p>
                  )}
                  <ul className="text-gray-600 list-disc list-inside space-y-2">
                    {description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  {subscription === plan && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      You already have this plan.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={handleSubscribe}
              className={`mt-6 w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 ${
                loading || subscription === selectedPlan ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading || subscription === selectedPlan}
            >
              {loading ? 'Processing...' : 'Subscribe'}
            </button>
          </>
        )}
  
        {subscription !== 'Default' && licenseStatus === 'Approved' && (
          <button
            onClick={handleUnsubscribe}
            className="mt-4 w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Unsubscribe'}
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
  
};

export default SubscriptionPage;









