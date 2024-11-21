import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from './useProducts';

const ProductsHome = () => {
  const { products, loading, error } = useProducts();
  console.log(useProducts);
  const [sortCategory, setSortCategory] = useState('');
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter products by category
  const filteredProducts = sortCategory
    ? products.filter((product) => product.category === sortCategory)
    : products;

  // Display products up to the visible count
  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  // Handle category change with animation
  const handleCategoryChange = (category) => {
    if (sortCategory !== category) {
      setIsAnimating(true);
      setTimeout(() => {
        setSortCategory(category);
        setVisibleProducts(6); // Reset visible products
        setIsAnimating(false);
      }, 500); // Match the duration of the animation
    }
  };

  // Load more products
  const handleViewMore = () => {
    setVisibleProducts((prev) => prev + 6);
  };

  const uniqueCategories = Array.from(new Set(products.map((product) => product.category)));

  return (
    <div className="p-4 sm:p-6">
      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <button
          onClick={() => handleCategoryChange('')}
          className={`px-4 py-2 text-sm sm:text-lg font-semibold rounded-full transition-transform duration-300 ${
            sortCategory === ''
              ? 'bg-black text-white transform scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Colors
        </button>
        {uniqueCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 text-sm sm:text-lg font-semibold rounded-full transition-transform duration-300 ${
              sortCategory === category
                ? 'bg-black text-white transform scale-105 shadow-lg'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div
        id="product-grid"
        className={`grid grid-cols-3 gap-4 sm:gap-6 md:grid-cols-3 lg:gap-8 transition-transform duration-500 ${
          isAnimating ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        {displayedProducts.map((product) => (
          <div
            key={product._id}
            className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
          >
            {/* Lazy Loaded Product Image */}
            <img
              src={product.imageUrl}
              alt={product.productName}
              loading="lazy" // Native lazy loading
              className="w-full h-auto object-cover"
            />

            {/* Product Details */}
            <div className="p-4">
              <h2
                className="text-base sm:text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide truncate"
                style={{
                  fontSize: `clamp(0.75rem, ${Math.min(16 / product.productName.length, 1)}rem, 1.25rem)`,
                }}
              >
                {product.productName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">Color: {product.category}</p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link
                to={`/product/${product._id}`}
                className="text-white text-sm sm:text-lg font-semibold border border-white px-4 py-2 sm:px-6 sm:py-2 rounded-md hover:bg-white hover:text-black transition-colors"
              >
                View Pricing and Sizing
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {visibleProducts < filteredProducts.length && !isAnimating && (
        <div className="text-center mt-8">
          <button
            onClick={handleViewMore}
            className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-300"
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsHome;










