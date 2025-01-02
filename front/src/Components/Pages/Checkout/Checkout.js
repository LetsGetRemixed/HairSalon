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
  const [shippingMethod, setShippingMethod] = useState('Ground');
  const [shippingCost, setShippingCost] = useState(5.0); // Default shipping cost for 'Ground'
  const [clientSecret, setClientSecret] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
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
  const [billingInfo, setBillingInfo] = useState({
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

  const dimensions = {
    length: (22.23 / 2.54).toFixed(2), // Convert cm to inches
    width: (11.11 / 2.54).toFixed(2),
    height: (28.73 / 2.54).toFixed(2),
  };

  const fetchShippingCosts = async () => {
    try {
      // Origin is fixed
      const origin = {
        street: 'PO Box 270999',
        city: 'Flower Mound',
        state: 'TX',
        zip: '75027',
        country: 'US',
      };
  
      // Destination is based on user input
      const destination = {
        street: shippingInfo.address.line1,
        city: shippingInfo.address.city,
        state: shippingInfo.address.state,
        zip: shippingInfo.address.postal_code,
        country: shippingInfo.address.country,
        residential: true, // Assuming all destinations are residential
      };
  
      const weight = cart.reduce((total, product) => total + product.weight, 0); // Total weight
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fedex/get-shipping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          weight,
          dimensions,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const ground = data.results.find((r) => r.service === 'GROUND_HOME_DELIVERY');
        const twoDay = data.results.find((r) => r.service === 'FEDEX_2_DAY');
        const overnight = data.results.find((r) => r.service === 'PRIORITY_OVERNIGHT');
  
        setShippingOptions([
          { service: 'Ground', cost: ground?.cost || 0 },
          { service: '2Day', cost: twoDay?.cost || 0 },
          { service: 'Overnight', cost: overnight?.cost || 0 },
        ]);
  
        // Set default selection
        setShippingMethod('Ground');
        setShippingCost(ground?.cost || 0);
      } else {
        setMessage('Failed to fetch shipping costs.');
      }
    } catch (error) {
      console.error('Error fetching shipping costs:', error);
      setMessage('Error fetching shipping costs.');
    }
  };

  useEffect(() => {
    if (
      shippingInfo.address.line1 &&
      shippingInfo.address.city &&
      shippingInfo.address.state &&
      shippingInfo.address.postal_code &&
      shippingInfo.address.country
    ) {
      fetchShippingCosts();
    }
  }, [shippingInfo]);

  const handleShippingChange = (e) => {
    const selectedMethod = e.target.value;
    setShippingMethod(selectedMethod);

    const selectedOption = shippingOptions.find((option) => option.service === selectedMethod);
    setShippingCost(selectedOption?.cost || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      return;
    }
  
    setIsProcessing(true);
    setMessage('Processing payment...');
  
    const totalAmount = calculateSubtotal() + shippingCost;
  
    try {
      // Step 1: Create a Payment Intent on the server
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/checkout/checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount * 100, currency: 'usd' }), // Convert to cents
      });
  
      const data = await response.json();
      setClientSecret(data.clientSecret);
  
      // Step 2: Confirm the Payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billingInfo.name,
            email: billingInfo.email,
            address: billingInfo.address,
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
  
        // Step 3: Save the transaction data on the server
        const transactionData = {
          products: cart,
          buyerId: user.userId,
          shippingAddress: shippingInfo.address,
          totalAmount: paymentIntent.amount / 100, // Convert back to dollars
          isShipped: false,
          priority: shippingMethod, // Save selected shipping method
        };
  
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/transaction/save-transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        });
  
        // Store the order details
        setOrderDetails({
          products: cart,
          shippingAddress: shippingInfo.address,
          totalAmount: paymentIntent.amount / 100,
          priority: shippingMethod,
        });
  
        clearCart();
      }
    } catch (error) {
      setMessage('Failed to process payment. Please try again.');
      console.error('Error processing payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    {!orderDetails ? (
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
        {/* Shipping Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Shipping Information</h3>
          <div className="grid gap-4">
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

        {/* Billing Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Billing Information</h3>
          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={billingInfo.name}
              onChange={(e) =>
                setBillingInfo((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={billingInfo.email}
              onChange={(e) =>
                setBillingInfo((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={billingInfo.address.line1}
              onChange={(e) =>
                setBillingInfo((prev) => ({
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
                value={billingInfo.address.city}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
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
                value={billingInfo.address.state}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
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
                value={billingInfo.address.postal_code}
                onChange={(e) =>
                  setBillingInfo((prev) => ({
                    ...prev,
                    address: { ...prev.address, postal_code: e.target.value },
                  }))
                }
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <select
                  value={billingInfo.address.country}
                  onChange={(e) =>
                    setBillingInfo((prev) => ({
                      ...prev,
                      address: { ...prev.address, country: e.target.value },
                    }))
                  }
                  className="w-full p-3 border rounded"
                  required
                >
                  <option value="" disabled>Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="AU">Australia</option>
                  <option value="JP">Japan</option>
                  <option value="IN">India</option>
                  <option value="CN">China</option>
                  <option value="ZA">South Africa</option>
                  {/* Add more country options as needed */}
                </select>
          </div>
        </div>

        {/* Stripe Card Element */}
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

        {/* Shipping Method */}
        <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Shipping Method</h3>
              <select
                value={shippingMethod}
                onChange={handleShippingChange}
                className="w-full p-3 border rounded"
                required
              >
                {shippingOptions.map((option) => (
                  <option key={option.service} value={option.service}>
                    {option.service} - ${option.cost.toFixed(2)}
                  </option>
                ))}
              </select>
      </div>

        {/* Cart Summary */}
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
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Shipping:</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total:</span>
            <span>${(calculateSubtotal() + shippingCost).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Button */}
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
    

  ) : (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-3xl font-bold text-center font-cinzel text-green-600 mb-4">Order Placed!</h2>
      <p className="text-gray-700 mb-4 font-cinzel text-center">Your order has been placed successfully.</p>
      <p className="text-gray-700 mb-4 font-cinzel text-center">You will receive an email receipt for your order.</p>
      <button
        onClick={() => window.location.href = '/'}
        className="w-full p-3 bg-gray-900 text-white font-bold rounded hover:bg-gray-600"
      >
        Back to Home
      </button>
    </div>
  )}
</div>
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




