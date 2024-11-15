import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('');
const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    background: '#f9f9f9',
    outline: 'none'
};

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [cartItems, setCartItems] = useState([
        { category: 'Blonde', length: '20 inches', quantity: 2, totalAmount: 5000 },
        { category: 'Dark', length: '18 inches', quantity: 1, totalAmount: 2500 }
    ]);
    const [buyerDetails, setBuyerDetails] = useState({
        name: '',
        email: '',
        address: {
            line1: '',
            city: '',
            state: '',
            postal_code: '',
            country: ''
        }
    });

    useEffect(() => {
        // Calculate total amount for the cart
        const totalAmount = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

        fetch('http://localhost:5100/api/checkout/checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount, currency: 'usd' })
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch(error => setMessage('Failed to load payment details. Please try again.'));
    }, [cartItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);
        setMessage('Processing payment...');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: buyerDetails.name,
                    email: buyerDetails.email,
                    address: buyerDetails.address
                }
            }
        });

        if (error) {
            setMessage(`Payment failed: ${error.message}`);
            setIsProcessing(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment successful! Saving transaction...');

            const transactionData = {
                products: cartItems,
                buyer: {
                    name: buyerDetails.name,
                    email: buyerDetails.email
                },
                shippingAddress: buyerDetails.address,
                quantity: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                totalAmount: paymentIntent.amount / 100 // Convert to dollars
            };
            console.log(transactionData);


            fetch('http://localhost:5100/api/transaction/save-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            })
            .then(res => res.json())
            .then(data => {
                console.log('Transaction saved:', data);
            })
            .catch(error => console.error('Error saving transaction:', error.message));
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <h2 style={{ textAlign: 'center', color: '#4CAF50', marginBottom: '20px' }}>Test Your Purchase</h2>
    
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name</label>
            <input
                id="name"
                type="text"
                value={buyerDetails.name}
                onChange={(e) => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                required
                style={inputStyle}
            />
        </div>
    
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input
                id="email"
                type="email"
                value={buyerDetails.email}
                onChange={(e) => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                required
                style={inputStyle}
            />
        </div>
    
        <div style={{ marginBottom: '15px' }}>
            <label htmlFor="address-line1" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address Line 1</label>
            <input
                id="address-line1"
                type="text"
                value={buyerDetails.address.line1}
                onChange={(e) => setBuyerDetails({ ...buyerDetails, address: { ...buyerDetails.address, line1: e.target.value } })}
                required
                style={inputStyle}
            />
        </div>
    
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: '1' }}>
                <label htmlFor="city" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>City</label>
                <input
                    id="city"
                    type="text"
                    value={buyerDetails.address.city}
                    onChange={(e) => setBuyerDetails({ ...buyerDetails, address: { ...buyerDetails.address, city: e.target.value } })}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={{ flex: '1' }}>
                <label htmlFor="state" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>State</label>
                <input
                    id="state"
                    type="text"
                    value={buyerDetails.address.state}
                    onChange={(e) => setBuyerDetails({ ...buyerDetails, address: { ...buyerDetails.address, state: e.target.value } })}
                    required
                    style={inputStyle}
                />
            </div>
        </div>
    
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: '1' }}>
                <label htmlFor="postal_code" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Postal Code</label>
                <input
                    id="postal_code"
                    type="text"
                    value={buyerDetails.address.postal_code}
                    onChange={(e) => setBuyerDetails({ ...buyerDetails, address: { ...buyerDetails.address, postal_code: e.target.value } })}
                    required
                    style={inputStyle}
                />
            </div>
            <div style={{ flex: '1' }}>
                <label htmlFor="country" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Country</label>
                <input
                    id="country"
                    type="text"
                    value={buyerDetails.address.country}
                    onChange={(e) => setBuyerDetails({ ...buyerDetails, address: { ...buyerDetails.address, country: e.target.value } })}
                    required
                    style={inputStyle}
                />
            </div>
        </div>
    
        <div style={{ marginBottom: '20px' }}>
            <label htmlFor="card-element" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Card Details</label>
            <div id="card-element" style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9' }}>
                <CardElement options={{ hidePostalCode: true }} />
            </div>
        </div>
    
        <button
            type="submit"
            disabled={!stripe || isProcessing}
            style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: isProcessing ? '#ccc' : '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: isProcessing ? 'not-allowed' : 'pointer'
            }}
        >
            {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        {message && (
            <p style={{ marginTop: '15px', textAlign: 'center', color: message.includes('failed') ? 'red' : 'green' }}>
                {message}
            </p>
        )}
    </form>
    
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}