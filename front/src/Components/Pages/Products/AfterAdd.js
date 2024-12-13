import React from 'react';
import { useNavigate } from 'react-router-dom';

const AfterAdd = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinueShopping = () => {
    navigate('/#products'); // Navigate to the #products section
    onClose(); // Close the modal after navigation
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose} // Close lightbox when clicking outside the modal
    >
      <div
        className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg "
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-center">
          Item Added to Cart!
        </h2>
        <p className="text-gray-600 mb-6 flex justify-center">
          Would you like to continue shopping or proceed to checkout?
        </p>
        {/* Center the buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={handleContinueShopping} // Continue shopping handler
          >
            Continue Shopping
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            onClick={() => navigate('/checkout')}
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AfterAdd;

