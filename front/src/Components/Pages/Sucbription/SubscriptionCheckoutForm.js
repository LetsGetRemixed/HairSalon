import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';
import { AuthContext } from '../Account/AuthContext';
import { useSubscription } from './SubscriptionContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SubscriptionCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const { selectedPlan } = useSubscription(); // Assuming selectedPlan is managed in SubscriptionContext
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

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
      // Step 1: Create the Payment Intent on the server
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/create-payment-intent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            subscriptionType: selectedPlan,
          }),
        }
      );

      const { clientSecret } = await response.json();

      // Step 2: Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (error) {
        setMessage(`Payment failed: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment successful! Updating subscription...');
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/subscription/update-user-subscription`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.userId,
            subscriptionType: selectedPlan,
          }),
        });
        setMessage('Subscription updated successfully!');
      }
    } catch (err) {
      console.error('Error processing subscription payment:', err);
      setMessage('Failed to process payment. Please try again.');
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
            message.includes('failed') ? 'text-red-500' : 'text-green-500'
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
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
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
