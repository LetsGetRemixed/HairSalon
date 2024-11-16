import React from 'react';
import useProducts from './useProducts';

const ProductsHome = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-lg shadow-lg p-4 hover:shadow-2xl transition duration-300"
        >
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-48 object-cover mb-4 rounded"
          />
          <h2 className="text-lg font-bold mb-2">{product.productName}</h2>
          <p className="text-sm text-gray-500">{product.category}</p>
          <ul className="mt-2">
            {product.variants.map((variant, index) => (
              <li key={index} className="text-sm">
                {variant.length} - ${variant.prices.suggestedRetailPrice}
              </li>
            ))}
          </ul>
          {product.recommendedNames.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Recommended Names: {product.recommendedNames.join(', ')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductsHome;




