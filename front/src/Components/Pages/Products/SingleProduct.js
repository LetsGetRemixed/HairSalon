import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from './useProducts';
import { AuthContext } from '../Account/AuthContext';
import { useSubscription } from '../Sucbription/SubscriptionContext'; // Import SubscriptionContext
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';
import axios from 'axios';
import AfterAdd from './AfterAdd';

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { membershipType } = useSubscription(); // Get subscription tier
  
  const { user } = useContext(AuthContext);
  const [selectedLength, setSelectedLength] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAfterAddOpen, setIsAfterAddOpen] = useState(false);

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
    console.log('Subscription:', membershipType);
    switch (membershipType) {
      case 'Ambassador':
        return prices.ambassadorPrice;
      case 'Stylist':
        return prices.stylistPrice;
      case 'Default':
      default:
        return prices.suggestedRetailPrice;
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if(membershipType === 'Default') {
      navigate('/subscribe');
      return;
    }

    if (!selectedLength) {
      alert('Please select a length before adding to the cart.');
      return;
    }
  
    const productToAdd = {
      productId: product._id,
      length: selectedVariant.length,
      quantity: selectedQuantity,
      weight: product.weight,
    };
  
    console.log('Product to Add:', productToAdd); // Debugging log to verify request data // Debugging log to verify request data
  
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/cart/add-to-cart/${user.userId}`,
        productToAdd
      );
      setIsAfterAddOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-start font-cinzel">
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
          <div className="flex-1 flex flex-col justify-between">
            <div>
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

              {/* Quantity Selection */}
                        <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">Select Quantity:</h2>
                      {selectedVariant ? (
                        <>
                          <p className="text-sm text-gray-600 mb-2">
                            {selectedVariant.quantity > 5
                              ? "In Stock"
                              : "Low Quantity: May add to shipping time"}
                          </p>
                          {selectedVariant.quantity > 0 ? (
                            <input
                              type="number"
                              min="1"
                              max={selectedVariant.quantity}
                              value={selectedQuantity}
                              onChange={(e) => {
                                const value = Math.min(
                                  Number(e.target.value),
                                  selectedVariant.quantity
                                );
                                setSelectedQuantity(value);
                              }}
                              className="w-20 p-2 border rounded-md"
                            />
                          ) : (
                            <p className="text-red-600 font-bold">Out of Stock</p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-600">Please select a length to see quantity details.</p>
                      )}
                    </div>

              {/* Pricing Details */}
              {selectedVariant ? (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Pricing:</h2>
                  <ul className="text-gray-700 space-y-2">
                    {membershipType !== 'Default' && (
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
                 
                </div>
              ) : (
                <p className="text-gray-600 text-sm">Please select a length to see pricing.</p>
              )}
            </div>

            {/* Product Description */}
            {product.description && (
  <div className="mt-6 font-cinzel">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">About {product.productName}:</h2>
    <p className="text-gray-600 text-md">{product.description}</p>
  </div>
)}
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="mt-8 px-4 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              Add to Cart
            </button>
                        {/* Additional Message */}
                    <div className="mt-8 text-center text-sm text-gray-600">
                      For orders larger than available quantity, please reach out to{" "}
                      <a
                        href="mailto:support@boldhairco.com"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        support@boldhairco.com
                      </a>{" "}
                      for product availability or to place large orders.
                    </div>


          </div>
        </div>
      </div>
      <Footer />

                 {/* AfterAdd Lightbox */}
                  <AfterAdd
                    isOpen={isAfterAddOpen}
                    onClose={() => setIsAfterAddOpen(false)}
                  />
    </div>
  );
};

export default SingleProduct;









