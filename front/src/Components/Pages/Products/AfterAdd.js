import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Checkout/CartContext'; // Import useCart to access fetchCart

const AfterAdd = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { fetchCart } = useCart(); // Access fetchCart from CartContext

  useEffect(() => {
    if (isOpen) {
      fetchCart(); // Fetch the updated cart whenever the modal is opened
    }
  }, [isOpen, fetchCart]);

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    navigate('/#products'); // Navigate to the #products section
    onClose(); // Close the modal after navigation
  };

  const handleCheckout = () => {
    fetchCart(); // Ensure the cart is updated before navigating
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} // Close lightbox when clicking outside the modal
    >
      <div
        className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-center">
          Item Added to Cart!
        </h2>
        <p className="text-gray-600 mb-6 flex justify-center">
          Would you like to continue shopping or proceed to checkout?
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={handleContinueShopping} // Continue shopping handler
          >
            Continue Shopping
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={handleCheckout} // Trigger cart fetch and navigate
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfterAdd;

