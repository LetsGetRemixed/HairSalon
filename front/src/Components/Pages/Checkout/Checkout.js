import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, calculateSubtotal, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const totalAmount = calculateSubtotal();
      console.log('Cart Data:', cart);
      try {
        const response = await fetch('http://localhost:5100/api/checkout/checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount * 100, currency: 'usd' }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        setMessage('Failed to load payment details. Please try again.');
      }
    };

    fetchPaymentIntent();
  }, [calculateSubtotal, cart]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setIsProcessing(true);
    setMessage('Processing payment...');

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          address: shippingInfo.address,
        },
      },
    });

    if (error) {
      setMessage(`Payment failed: ${error.message}`);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful! Saving transaction...');

      const transactionData = {
        products: cart,
        buyer: {
          name: shippingInfo.name,
          email: shippingInfo.email,
        },
        shippingAddress: shippingInfo.address,
        totalAmount: paymentIntent.amount / 100, // Convert to dollars
      };

      try {
        await fetch('http://localhost:5100/api/transaction/save-transaction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });
        setMessage('Transaction saved successfully!');
        clearCart();
      } catch (error) {
        console.error('Error saving transaction:', error.message);
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Checkout</h2>
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
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Shipping Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={(e) =>
                setShippingInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={shippingInfo.email}
              onChange={(e) =>
                setShippingInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-3 border rounded"
              required
            />
          </div>
          <div className="grid gap-4 mt-4">
            <input
              type="text"
              placeholder="Address Line 1"
              value={shippingInfo.address.line1}
              onChange={(e) =>
                setShippingInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              className="w-full p-3 border rounded"
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                value={shippingInfo.address.city}
                onChange={(e) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value },
                  }))
                }
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingInfo.address.state}
                onChange={(e) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value },
                  }))
                }
                className="w-full p-3 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingInfo.address.postal_code}
                onChange={(e) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, postal_code: e.target.value },
                  }))
                }
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Country"
              value={shippingInfo.address.country}
              onChange={(e) =>
                setShippingInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value },
                }))
              }
              className="w-full p-3 border rounded"
              required
            />
          </div>
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
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Cart Summary</h3>
          <ul className="divide-y">
                  {cart.map((item, index) => (
                    <li key={index} className="flex justify-between py-2">
                      <span>
                        {item.name} - {item.length} (x{item.quantity})
                      </span>
                      
                      <span>${item.price?.toFixed(2) || 'N/A'}</span>
                    </li>
                  ))}
                </ul>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className={`w-full p-3 text-white font-bold rounded ${
            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

export default function Checkout() {
  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
      <Footer />
    </div>
  );
}
