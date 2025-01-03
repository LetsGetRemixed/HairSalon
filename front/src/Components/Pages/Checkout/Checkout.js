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
  const [shippingMethod, setShippingMethod] = useState('notSelected');
  const [shippingCost, setShippingCost] = useState(30.00); // Default shipping cost for 'Ground'
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
    length: parseFloat((22.23 / 2.54).toFixed(2)), // Convert cm to inches and parse as float
    width: parseFloat((11.11 / 2.54).toFixed(2)),
    height: parseFloat((28.73 / 2.54).toFixed(2)),
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
  
      const weight = cart.reduce((total, product) => {
        return total + product.weight * product.quantity;
      }, 0); // Total weight in pounds
      console.log('Total weight:', weight);
      console.log('Dimensions:', dimensions);
      console.log('weight:', cart[0].weight);
      console.log('quantity:', cart[0].quantity);
  
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

      //log the every input in the data sent to response
      console.log('Origin:', origin);
      console.log('Destination:', destination);
      console.log('Weight:', weight);
      console.log('Dimensions:', dimensions);
      

      console.log('Response:', response);
  
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
        setShippingOptions([]);
        setShippingMethod('notSelected');
        console.log('Failed to fetch shipping costs.');
      }
    } catch (error) {
      console.error('Error fetching shipping costs:', error);
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
    console.log('Selected option:', selectedMethod);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!stripe || !elements) {
      setMessage('Stripe has not loaded yet.');
      return;
    }

    if (shippingMethod === 'notSelected') {
      setMessage('Please select a shipping method.');
      return;
    }
  
    // Check if subtotal is greater than 0
    if (calculateSubtotal() === 0) {
      setMessage('Your cart is empty. Add items to proceed.');
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

        console.log('Transaction data:', transactionData);
  
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
             <select
      value={shippingInfo.address.state}
      onChange={(e) =>
        setShippingInfo((prev) => ({
          ...prev,
          address: { ...prev.address, state: e.target.value },
        }))
      }
      className="w-full p-3 border rounded"
      required
    >
      <option value="" disabled>Select State</option>
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <option value="AR">Arkansas</option>
      <option value="CA">California</option>
      <option value="CO">Colorado</option>
      <option value="CT">Connecticut</option>
      <option value="DE">Delaware</option>
      <option value="FL">Florida</option>
      <option value="GA">Georgia</option>
      <option value="HI">Hawaii</option>
      <option value="ID">Idaho</option>
      <option value="IL">Illinois</option>
      <option value="IN">Indiana</option>
      <option value="IA">Iowa</option>
      <option value="KS">Kansas</option>
      <option value="KY">Kentucky</option>
      <option value="LA">Louisiana</option>
      <option value="ME">Maine</option>
      <option value="MD">Maryland</option>
      <option value="MA">Massachusetts</option>
      <option value="MI">Michigan</option>
      <option value="MN">Minnesota</option>
      <option value="MS">Mississippi</option>
      <option value="MO">Missouri</option>
      <option value="MT">Montana</option>
      <option value="NE">Nebraska</option>
      <option value="NV">Nevada</option>
      <option value="NH">New Hampshire</option>
      <option value="NJ">New Jersey</option>
      <option value="NM">New Mexico</option>
      <option value="NY">New York</option>
      <option value="NC">North Carolina</option>
      <option value="ND">North Dakota</option>
      <option value="OH">Ohio</option>
      <option value="OK">Oklahoma</option>
      <option value="OR">Oregon</option>
      <option value="PA">Pennsylvania</option>
      <option value="RI">Rhode Island</option>
      <option value="SC">South Carolina</option>
      <option value="SD">South Dakota</option>
      <option value="TN">Tennessee</option>
      <option value="TX">Texas</option>
      <option value="UT">Utah</option>
      <option value="VT">Vermont</option>
      <option value="VA">Virginia</option>
      <option value="WA">Washington</option>
      <option value="WV">West Virginia</option>
      <option value="WI">Wisconsin</option>
      <option value="WY">Wyoming</option>
    </select>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={shippingInfo.address.postal_code}
                  onChange={(e) => {
                    const zipCode = e.target.value;
                    if (/^\d{0,5}$/.test(zipCode)) { // Allow only valid ZIP codes (up to 5 digits)
                      setShippingInfo((prev) => ({
                        ...prev,
                        address: { ...prev.address, postal_code: zipCode },
                      }));
                    }
                  }}
                  className="w-full p-3 border rounded"
                  required
                />
              </div>
              <select
                    value={shippingInfo.address.country}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        address: { ...prev.address, country: e.target.value },
                      }))
                    }
                    className="w-full p-3 border rounded"
                    required
                  >
                    <option value="" disabled>Select Country</option>
                    <option value="US">United States</option>
                  </select>
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
              <select
  value={billingInfo.address.state}
  onChange={(e) =>
    setBillingInfo((prev) => ({
      ...prev,
      address: { ...prev.address, state: e.target.value },
    }))
  }
  className="w-full p-3 border rounded"
  required
>
  <option value="" disabled>Select State</option>
  <option value="AL">Alabama</option>
  <option value="AK">Alaska</option>
  <option value="AZ">Arizona</option>
  <option value="AR">Arkansas</option>
  <option value="CA">California</option>
  <option value="CO">Colorado</option>
  <option value="CT">Connecticut</option>
  <option value="DE">Delaware</option>
  <option value="FL">Florida</option>
  <option value="GA">Georgia</option>
  <option value="HI">Hawaii</option>
  <option value="ID">Idaho</option>
  <option value="IL">Illinois</option>
  <option value="IN">Indiana</option>
  <option value="IA">Iowa</option>
  <option value="KS">Kansas</option>
  <option value="KY">Kentucky</option>
  <option value="LA">Louisiana</option>
  <option value="ME">Maine</option>
  <option value="MD">Maryland</option>
  <option value="MA">Massachusetts</option>
  <option value="MI">Michigan</option>
  <option value="MN">Minnesota</option>
  <option value="MS">Mississippi</option>
  <option value="MO">Missouri</option>
  <option value="MT">Montana</option>
  <option value="NE">Nebraska</option>
  <option value="NV">Nevada</option>
  <option value="NH">New Hampshire</option>
  <option value="NJ">New Jersey</option>
  <option value="NM">New Mexico</option>
  <option value="NY">New York</option>
  <option value="NC">North Carolina</option>
  <option value="ND">North Dakota</option>
  <option value="OH">Ohio</option>
  <option value="OK">Oklahoma</option>
  <option value="OR">Oregon</option>
  <option value="PA">Pennsylvania</option>
  <option value="RI">Rhode Island</option>
  <option value="SC">South Carolina</option>
  <option value="SD">South Dakota</option>
  <option value="TN">Tennessee</option>
  <option value="TX">Texas</option>
  <option value="UT">Utah</option>
  <option value="VT">Vermont</option>
  <option value="VA">Virginia</option>
  <option value="WA">Washington</option>
  <option value="WV">West Virginia</option>
  <option value="WI">Wisconsin</option>
  <option value="WY">Wyoming</option>
</select>
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

          
          <div className="text-sm text-left text-gray-600 mt-4">
            
                <p className="py-1">
                  If you do not see "Shipping Method" option, you might have entered wrong shipping information.
                  Please check your address and try again.
                  </p>
                  <p className="py-1"> Pay Now will proccess your payment. We do not collect any billing information.</p>
                  <p className="py-1">By clicking "Pay Now," you agree to our terms and conditions.</p>
                  <p className="py-1">For problems, please contact us at <a href="mailto:support@boldhairco.com">support@boldhairco.com</a>.</p>
            
          </div>

          
        
      </div>
    </form>
    

  ) : (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded">
      <h2 className="text-3xl font-bold text-center font-cinzel text-green-600 mb-4">Order Placed!</h2>
      <h2 className="text-3xl font-bold text-center font-cinzel text-gray-900 mb-4">Thank you for your purchase!</h2>
      <p className="text-gray-700 mb-4 font-cinzel text-center">Your order has been placed successfully.</p>
      <p className="text-gray-700 mb-4 font-cinzel text-center">You will receive an email receipt for your order.</p>
      <p className="text-gray-700 mb-4 font-cinzel text-center">If you have any questions or concerns, please do not hesitate to contact us.</p>
      <p className="text-gray-700 mb-4 font-cinzel text-center">We look forward to serving you!</p>
      
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




