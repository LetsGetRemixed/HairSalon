import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCart } from './CartContext';
import { useAuth } from '../Account/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const Cart = () => {
  const { user } = useAuth();
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [cartFetched, setCartFetched] = useState(false);
  const navigate = useNavigate();

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/cart/remove-from-cart/${user.userId}/${productId}`
      );
      console.log('Removing items: ', productId);
      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cart/clear-cart/${user.userId}`);
      setCart([]); 
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

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

  useEffect(() => {
    const fetchCart = async () => {
      console.log('Fetching cart...');
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/cart/get-cart/${user.userId}`
        );
        const cartWithDetails = await Promise.all(response.data.map(async (item) => {
          try {
            const productResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/items/getItem/${item.productId}`);
            console.log('Fetched product details:', productResponse.data);
            const product = productResponse.data;
            const applicablePrice = getApplicablePrice(product.variants[0].prices, user.subscription);
            return {
              ...item,
              name: product.productName,
              price: applicablePrice,
              imageUrl: product.imageUrl,
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return item;
          }
        }));

        // Only update the cart if the new data is different
        console.log('Current cart:', cart);
        console.log('New cart details:', cartWithDetails);
        if (JSON.stringify(cart) !== JSON.stringify(cartWithDetails)) {
          console.log('Updating cart state with new details:', cartWithDetails);
          setCart(cartWithDetails);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !cartFetched) {
      fetchCart();
      setCartFetched(true);
    }
  }, [user, cartFetched]);

  const handleQuantityChange = async (itemId, delta) => {
    const newQuantity = Math.max(1, cart.find((item) => item.productId === itemId).quantity + delta);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/cart/update-quantity/${user.userId}`,
        { productId: itemId, newQuantity }
      );
      console.log('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
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
      (total, item) => total + (item.price || 0) * item.quantity,
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
                      src={item.imageUrl || '/placeholder.jpg'} // Ensure the correct field is used
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
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
                <span>${cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0).toFixed(2)}</span>
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
        <Footer />
    </div>
  );
};

export default Cart;














