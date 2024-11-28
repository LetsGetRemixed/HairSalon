import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAuth } from '../Account/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user } = useAuth();
  const { cart, setCart, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/cart/${user.userId}`
        );
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCart();
  }, [user]);

  const handleQuantityChange = (itemId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handlePromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10);
    } else {
      alert('Invalid promo code!');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return subtotal - discount;
  };

  if (loading) return <p>Loading...</p>;

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">My Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 border rounded shadow mb-4"
            >
              <div className="flex items-center space-x-4">
                    <img
                        src={item.imageUrl || '/placeholder.jpg'} // Ensure the correct field is used
                        alt={item.name || 'Product Image'}
                        className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-500 text-sm">Length: {item.length}</p>
                        <p className="text-gray-500 text-sm">Price: ${item.price.toFixed(2)}</p>
                    </div>
                    </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="p-4 border rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Discount:</span>
            <span>${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 border-t pt-2">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={handlePromoCode}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Apply
            </button>
          </div>
          <button
            onClick={clearCart}
            className="w-full mb-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;



