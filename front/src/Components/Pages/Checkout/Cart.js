import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useSubscription } from '../Sucbription/SubscriptionContext';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const Cart = () => {
  const {
    cart,
    loading,
    fetchCart,
    removeFromCart,
    updateCartItemQuantity,
    applyPromoCode,
    discount,
    calculateSubtotal,
    calculateTotal,
  } = useCart();

  const { membershipType } = useSubscription();
  const [promoCode, setPromoCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart(membershipType); // Fetch the cart when the component mounts
  }, [fetchCart, membershipType]);

  const handleQuantityChange = (itemId, length, delta) => {
    const item = cart.find((item) => item.productId === itemId && item.length === length);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      updateCartItemQuantity(itemId, length, newQuantity);
    }
  };

  const handleApplyPromoCode = () => {
    if (!applyPromoCode(promoCode)) {
      alert('Invalid promo code!');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <p>Loading...</p>;

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const isCartEmpty = cart.length === 0;

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {isCartEmpty ? (
              <div className="flex items-center justify-center h-64">
                <h2 className="text-4xl font-bold text-gray-600">Your cart is empty</h2>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.length}`}
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
                      <p className="text-gray-500 text-sm">
                        Price: ${item.price ? item.price.toFixed(2) : 'N/A'}
                      </p>
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
              ))
            )}
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
                onClick={handleApplyPromoCode}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Apply
              </button>
            </div>
           
            <button
              onClick={handleCheckout}
              disabled={isCartEmpty} // Disable the button if the cart is empty
              className={`w-full px-4 py-2 rounded ${
                isCartEmpty
                  ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800 text-white'
              }`}
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

















