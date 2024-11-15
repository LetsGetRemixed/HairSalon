import React from 'react';
import { Link } from 'react-router-dom';
import useProducts from './useProducts';

const ProductsHome = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
  } = useProducts();

  return (
    <div className="flex flex-col md:flex-row container mx-auto p-4">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-100 p-4 rounded-md">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-2">
          <li
            onClick={() => setSelectedCategory('')}
            className={`cursor-pointer hover:text-blue-500 ${
              !selectedCategory ? 'font-bold text-blue-500' : ''
            }`}
          >
            All Products
          </li>
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer hover:text-blue-500 ${
                selectedCategory === category ? 'font-bold text-blue-500' : ''
              }`}
            >
              {category}
            </li>
          ))}
        </ul>

        {/* Sorting Filters */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Sort By</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Option</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
            <option value="name_desc">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Product Listing */}
      <div className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded-md p-4 shadow-sm hover:shadow-md transition">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.imageUrl || '/placeholder.png'} // Replace with actual image logic
                alt={product.productName}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-bold">{product.productName}</h3>
              <p className="text-gray-700">
                ${product.variants[0]?.prices.suggestedRetailPrice || 'N/A'}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsHome;
