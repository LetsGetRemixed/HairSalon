import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from './SubscriptionContext';
import { AuthContext } from '../Account/AuthContext';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const SubscriptionPage = () => {
  const { subscription, membershipType, nextBillingDate, licenseStatus, selectedPlan, selectPlan, refreshSubscription } = useSubscription();
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
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
        <h1 className="text-4xl font-cinzel mb-6 text-center">BOLD SUBSCRIPTIONS</h1>
        
        {/* Benefits Section */}
        {licenseStatus !== 'Approved' && (
  <div className="bg-[#fef7e0] p-8 rounded-lg shadow-lg border border-[#e4cfa8] mb-6">
    <h2
      className="text-5xl font-bold text-center mb-6 font-cinzel text-[#c29d60]"
      style={{
        textTransform: 'uppercase', // Adds emphasis to the text
        letterSpacing: '2px', // Adds elegance and spacing
      }}
    >
      Unlock Exclusive Benefits by Uploading Your License!
    </h2>
    <p className="text-lg text-[#5f5340] mb-4 font-medium">
      As a licensed stylist, you'll gain access to exclusive discounts on all products, saving you money on the supplies you need most.
      But that’s not all – you’ll also be eligible to join our special Ambassador memberships, unlocking even greater perks and rewards.
    </p>
    <ul className="list-disc list-inside text-[#6b5d47] space-y-2">
    <li>Access to purchase our full inventory of products.</li>
      <li>Exclusive pricing on every product in our store.</li>
      <li>Access to premium membership plans with enhanced discounts.</li>
      <li>Priority support from our dedicated customer service team.</li>
      <li>Be part of a thriving community of top stylists and ambassadors.</li>
    </ul>
    <p className="mt-4 text-center text-[#8a6a3d] font-semibold">
      Upload your license today and start reaping the benefits!
    </p>
  </div>
)}



        {licenseStatus === 'Pending' && (
          <p className="text-yellow-600 font-medium text-center mb-4">
            Your license is pending approval. You will receive "Stylist" membership upon approval.
          </p>
        )}
        {licenseStatus === 'Rejected' && (
          <p className="text-red-600 font-medium text-center mb-4">
            Your license was rejected. Please upload a valid license.
          </p>
        )}
        {licenseStatus === 'Approved' && subscription && subscription !== 'Default' && (
          <p className="text-green-600 font-medium text-center mb-4">
            Your current plan: <strong>{membershipType}</strong>
            <p>Next billing date: {nextBillingDate}</p>
          </p>
          
          
        )}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {licenseStatus !== 'Approved' && (
          <button
            onClick={handleUploadLicense}
            className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-gray-600"
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
          price: '$50 / Month',
          description: [
            'Exclusive access to Ambassador tools.',
            'Priority customer support.',
            'Even more discounts on all products!',
          ],
        },
        {
          plan: 'Ambassador for 1 Year',
          price: '$540 / Year',
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
            membershipType === plan
              ? 'border-gray-400 bg-gray-200 cursor-not-allowed'
              : selectedPlan === plan
              ? 'border-green-500 bg-green-100'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={() => {
            if (membershipType !== plan) selectPlan(plan);
          }}
          style={{
            pointerEvents: membershipType === plan ? 'none' : 'auto', // Disable interaction if already subscribed
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
          {membershipType === plan && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              You are currently on this plan.
            </p>
          )}
        </div>
      ))}
    </div>
    <button
      onClick={handleSubscribe}
      className={`mt-6 w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 ${
        loading || membershipType === selectedPlan
          ? 'opacity-50 cursor-not-allowed'
          : ''
      }`}
      disabled={loading || membershipType === selectedPlan }
    >
      {loading ? 'Processing...' : 'Subscribe'}
    </button>
  </>
)}


        {membershipType !== 'Default' && membershipType !== 'Stylist' && licenseStatus === 'Approved' && (
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









