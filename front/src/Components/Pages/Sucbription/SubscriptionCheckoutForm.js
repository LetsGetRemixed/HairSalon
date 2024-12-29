import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';
import { AuthContext } from '../Account/AuthContext';
import { useSubscription } from './SubscriptionContext';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const { selectedPlan, refreshSubscription } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    if (!selectedPlan) {
      setMessage('No subscription plan selected.');
    }
  }, [selectedPlan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      return;
    }
  
    setIsProcessing(true);
    setMessage('Processing subscription payment...');
  
    try {
      // Step 1: Create the Payment Method
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error: paymentError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
  
      if (paymentError) {
        setMessage(`Payment method error: ${paymentError.message}`);
        setIsProcessing(false);
        return;
      }
  
      // Step 2: Create the Stripe Subscription
      const interval = selectedPlan === 'Ambassador for 1 Year' ? 'Yearly' : 'Monthly';
      console.log('Interval is ', interval);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/checkout/create-subscription`,
        {
          paymentMethodId: paymentMethod.id,
          interval,
        }
      );
  
      const { subscriptionId: stripeSubscriptionId, customerId: customerId } = response.data; // Cancel -> monthly -> Yearly
      console.log('here',stripeSubscriptionId)
      console.log('hey here',customerId);
  
      if (!stripeSubscriptionId) {
        setMessage(`Subscription creation failed:  || 'Unknown error'}`);
        setIsProcessing(false);
        return;
      }
  
      setSubscriptionId(stripeSubscriptionId);
      console.log('Selected plan', selectedPlan);
  
      // Step 3: Update Subscription in the Database
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/create-membership/${user.userId}`,
        {
          subscriptionId: stripeSubscriptionId,
          customerId: customerId,
          subscriptionType: interval,
          membershipType: 'Ambassador',
        }
      );
  
      setMessage('Subscription updated successfully!');
      await refreshSubscription(); // Update context with the latest subscription
    } catch (err) {
      console.error('Error processing subscription:', err);
      setMessage('Failed to process subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Subscription Checkout</h2>
      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes('failed') || message.includes('Error') ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {message}
        </p>
      )}
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Selected Subscription</h3>
          <p className="text-center p-3 bg-gray-100 rounded">
            {selectedPlan ? `You have selected the ${selectedPlan} plan.` : 'No plan selected.'}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Payment Information</h3>
          <div className="p-3 border rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full p-3 text-white font-bold rounded ${
            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>
      {subscriptionId && (
        <p className="text-center mt-4 text-sm text-gray-600">
          Subscription ID: <span className="font-mono">{subscriptionId}</span>
        </p>
      )}
    </form>
  );
};

export default function SubscriptionCheckout() {
  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <Elements stripe={stripePromise}>
          <SubscriptionCheckoutForm />
        </Elements>
      </div>
      <Footer />
    </div>
  );
}


