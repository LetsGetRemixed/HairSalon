import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from './CartContext';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';
import { AuthContext } from '../Account/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
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
  const [shippingCost, setShippingCost] = useState(0);
   // Fetch Shipping Cost
   const fetchShippingCost = async () => {
    const requestPayload = {
      origin: {
        street: "123 Main St",
        city: "Memphis",
        state: "TN",
        zip: "38116",
        country: "US",
      },
      destination: {
        street: "456 Elm St",
        city: "Dallas",
        state: "TX",
        zip: "75201",
        country: "US",
        residential: true,
      },
      weight: 1, // in pounds
      dimensions: {
        length: 12,
        width: 10,
        height: 8,
      },
      serviceType: "STANDARD_OVERNIGHT",
    };

    try {
      const response = await fetch('http://localhost:5100/api/fedex/get-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const data = await response.json();
      console.log('Here is the data: ', data);

      if (data.success && data.results.length > 0) {
        const cost = data.results[0].cost;
        console.log('Here is the cost: ', cost);
        setShippingCost(cost);
      } else {
        setMessage('Failed to fetch shipping cost. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching shipping cost:', error);
      setMessage('Error calculating shipping. Please check your address and try again.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchShippingCost();
    console.log('Shipping cost is: ', shippingCost);

    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      return;
    }

    setIsProcessing(true);
    setMessage('Processing payment...');

    // Step 1: Fetch the Payment Intent from your backend
    const totalAmount = calculateSubtotal() + shippingCost;
    console.log('Total amount is ', totalAmount);
    try {
      const response = await fetch('http://localhost:5100/api/checkout/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount * 100, currency: 'usd' }), // Convert to cents
      });

      const data = await response.json();
      
      setClientSecret(data.clientSecret);

      // Step 2: Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
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

        // Step 3: Save the transaction in your backend
        const transactionData = {
          products: cart,
          buyerId: user.userId,
          shippingAddress: shippingInfo.address,
          totalAmount: paymentIntent.amount / 100, // Convert to dollars
        };
        console.log('Here is the transaction data: ', transactionData);

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
    } catch (error) {
      setMessage('Failed to process payment. Please try again.');
      console.error('Error fetching payment intent:', error);
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

