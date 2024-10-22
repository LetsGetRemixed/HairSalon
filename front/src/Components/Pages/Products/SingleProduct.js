import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details by ID
    axios.get(`/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.log(error));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center">
        {/* Product Image */}
        <div className="w-full md:w-1/2 p-4">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-md shadow-md" />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-2">${product.price}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          {/* Additional Information */}
          <div className="bg-gray-100 p-4 rounded-md mb-4">
            <h3 className="text-lg font-bold mb-2">Product Details</h3>
            <ul>
              {product.details.map((detail, index) => (
                <li key={index} className="text-gray-700">{detail}</li>
              ))}
            </ul>
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
