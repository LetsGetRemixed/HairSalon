import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QHD0NEnsP1F5DSTcre8eMS6aj0EXbWRn8BXpoCP9HtajcjO9Jpa9RscFUzL9ErD9Vjbs0mVH6smsspjIGwvTNym00wzka5HLW');

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch clientSecret when component loads
    React.useEffect(() => {
        fetch('http://localhost:5100/api/checkout/checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 5000, currency: 'usd' })
        })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret))
        .catch((error) => setMessage('Failed to load payment details. Please try again.'));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);
        setMessage('Processing payment...');

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: 'Customer Name', // Optional: Replace with dynamic customer info
                    address: {
                        postal_code: '90210', // Optional: Replace with dynamic postal code
                    }
                }
            }
        });

        if (error) {
            setMessage(`Payment failed: ${error.message}`);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment successful! Thank you.');
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Complete Your Purchase</h2>
            <CardElement options={{ hidePostalCode: false }} style={{ base: { fontSize: '18px' } }} />
            <button type="submit" disabled={!stripe || isProcessing} style={{ marginTop: '20px', padding: '10px', fontSize: '16px', backgroundColor: isProcessing ? '#ccc' : '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
            {message && <p style={{ marginTop: '15px', color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
        </form>
    );
}

export default function App() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
