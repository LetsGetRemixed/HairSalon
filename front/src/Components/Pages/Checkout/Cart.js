import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Account/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';
import { useSubscription } from '../Sucbription/SubscriptionContext';

const Cart = () => {
  const { user } = useAuth(); // Assuming this provides authenticated user info
  const { subscription } = useSubscription();
  const [cart, setCart] = useState([]); // Local cart state
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();


  const getApplicablePrice = (prices, subscription) => {
    switch (subscription) {
      case 'Gold':
        return prices.ambassadorPrice;
      case 'Silver':
        return prices.stylistPrice;
      case 'Bronze':
      default:
        return prices.suggestedRetailPrice;
    }
  };

  const fetchCart = async () => {
    if (!user) return; // Ensure user is logged in
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cart/get-cart/${user.userId}`
      );

      const cartWithDetails = await Promise.all(
        response.data.map(async (item) => {
          try {
            const productResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/items/getItem/${item.productId}`
            );
            const product = productResponse.data;
            const selectedVariant = product.variants.find(variant => variant.length === item.length);
            const applicablePrice = getApplicablePrice(selectedVariant.prices, subscription);
            console.log('Applicable price:', applicablePrice);
            return {
              ...item,
              name: product.productName,
              imageUrl: product.imageUrl,
              price: applicablePrice,
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return item; // Return item without details if fetching fails
          }
        })
      );

      setCart(cartWithDetails);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/cart/remove-from-cart/${user.userId}`,
        { data: { productId } }
      );
      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cart/clear-cart/${user.userId}`);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleQuantityChange = async (itemId, length, delta) => {
    const updatedCart = cart.map((item) =>
      item.productId === itemId && item.length === length
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCart(updatedCart);
  
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/cart/update-quantity/${user.userId}`,
        {
          productId: itemId,
          length,
          newQuantity: updatedCart.find(
            (item) => item.productId === itemId && item.length === length
          ).quantity,
        }
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handlePromoCode = () => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10); // Example flat discount
    } else {
      alert('Invalid promo code!');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal - discount;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center p-4 border rounded shadow mb-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.imageUrl || '/placeholder.jpg'}
                    alt={item.name || 'Product Image'}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-sm">Length: {item.length}</p>
                    <p className="text-gray-500 text-sm">Price: ${item.price ? item.price.toFixed(2) : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.length, -1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.length, 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.productId)}
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
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 border-t pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
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
      <Footer />
    </div>
  );
};

export default Cart;














