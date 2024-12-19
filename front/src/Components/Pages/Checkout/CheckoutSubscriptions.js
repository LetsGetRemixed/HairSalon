import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';
import { AuthContext } from '../Account/AuthContext';
import axios from 'axios';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);



// Frontend is mostly unchanged
const Payment = ({ price, interval }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [subscriptionId, setSubscriptionId] = useState(null);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!stripe || !elements) return;
  
      setIsProcessing(true);
      const cardElement = elements.getElement(CardElement);
  
      try {
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
  
        const response = await fetch('http://localhost:5100/api/checkout/create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            interval: 'month',
          }),
        });
  
        const data = await response.json();
        if (data.subscriptionId) {
          setSubscriptionId(
          data.subscriptionId);
          alert('Subscription created successfully!');


          const response2 = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/subscription/create-membership/675b67cdadeaf26a182c9a48`,
            { 
              subscriptionId: data.subscriptionId,
              subscriptionType: 'Monthly',
              membershipType: 'Stylist'
             }
          );
        } else {
          alert('Failed to create subscription.');
        }
      } catch (error) {
        console.error('Error creating subscription:', error);
        alert('Error creating subscription');
      } finally {
        setIsProcessing(false);
      }
    };
  
  
    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button disabled={!stripe || isProcessing}>
          {isProcessing ? 'Processing...' : 'Subscribe'}
        </button>
        {subscriptionId && <div>Subscription ID: {subscriptionId}</div>}
      </form>
    );
  };

  export default function PaymentForm() {
    return (
      <div>
       
        <div className="p-6 bg-gray-100 min-h-screen">
          <Elements stripe={stripePromise}>
          <Payment interval="month" />
          </Elements>
        </div>
        
      </div>
    );
  }