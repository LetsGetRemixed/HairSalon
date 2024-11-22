import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import useProducts from './useProducts';
import { useSubscription } from '../Sucbription/SubscriptionContext'; // Import SubscriptionContext
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const SingleProduct = () => {
  const { id } = useParams();
  const { products, loading, error } = useProducts();
  const { subscription } = useSubscription(); // Get subscription tier
  const [selectedLength, setSelectedLength] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Find the specific product by ID
  const product = products.find((item) => item._id === id);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found.</p>;

  // Handle Modal Open/Close
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Handle Length Selection
  const selectedVariant = product.variants.find(
    (variant) => variant.length === selectedLength
  );

  // Determine the applicable price based on subscription
  const getApplicablePrice = (prices) => {
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

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Image Section */}
          <div className="flex-1">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full max-h-[600px] object-contain cursor-pointer rounded-lg shadow-lg"
              onClick={toggleModal}
            />
            {/* Modal */}
            {isModalOpen && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                onClick={toggleModal} // Close on click anywhere
              >
                <div className="relative">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-auto max-h-[90vh] max-w-[90vw] rounded-lg"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.productName}
            </h1>
            <p className="text-gray-600 text-sm mb-4">Category: {product.category}</p>

            {/* Length Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Length:</h2>
              <div className="flex gap-4 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.length}
                    onClick={() => setSelectedLength(variant.length)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedLength === variant.length
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {variant.length}
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Details */}
            {selectedVariant ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Pricing:</h2>
                <ul className="text-gray-700 space-y-2">
                  {subscription !== 'Bronze' && (
                    <li className="text-red-500 line-through">
                      Retail Price: ${selectedVariant.prices.suggestedRetailPrice}
                    </li>
                  )}
                  <li className="text-green-600 font-bold">
                    Your Price: ${getApplicablePrice(selectedVariant.prices)}
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Wefts per Pack: {selectedVariant.weftsPerPack}
                </p>
                <p className="text-sm text-gray-600">
                  Available Quantity: {selectedVariant.quantity || 'Out of Stock'}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">Please select a length to see pricing.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SingleProduct;






