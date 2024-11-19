import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from './useProducts';

const ProductsHome = () => {
  const { products, loading, error } = useProducts();
  const [sortCategory, setSortCategory] = useState('');

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  // Filter and sort products by category (color)
  const filteredProducts = sortCategory
    ? products.filter((product) => product.category === sortCategory)
    : products;

  // Show only the first 6 products
  const displayedProducts = filteredProducts.slice(0, 6);

  return (
    <div className="p-6">
      {/* Sort Filter */}
      <div className="mb-6">
        <label htmlFor="sort" className="block text-lg font-medium text-gray-800 mb-2">
          Sort by Color:
        </label>
        <select
          id="sort"
          value={sortCategory}
          onChange={(e) => setSortCategory(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-black"
        >
          <option value="">All Colors</option>
          {Array.from(new Set(products.map((product) => product.category))).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {displayedProducts.map((product) => (
          <div
            key={product._id}
            className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300"
          >
            {/* Product Image */}
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-full h-64 object-cover"
            />

            {/* Product Details */}
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-wide">
                {product.productName}
              </h2>
              <p className="text-sm text-gray-600">Color: {product.category}</p>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Link
                to={`/product/${product._id}`}
                className="text-white text-lg font-semibold border border-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition-colors"
              >
                View Pricing and Sizing
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsHome;





