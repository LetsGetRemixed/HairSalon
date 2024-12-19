import React from "react";

const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{product.productName}</h2>
        <p className="text-gray-700 mb-2">
          <strong>Category:</strong> {product.category}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Description:</strong> {product.description || "N/A"}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Weight:</strong> {product.weight || "N/A"} lbs
        </p>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Variants:</h3>
        {product.variants && product.variants.length > 0 ? (
          product.variants.map((variant, index) => (
            <div key={index} className="border rounded p-2 mb-2">
              <p>
                <strong>Length:</strong> {variant.length}
              </p>
              <p>
                <strong>Wefts Per Pack:</strong> {variant.weftsPerPack}
              </p>
              <p>
                <strong>Retail Price:</strong> ${variant.prices.suggestedRetailPrice}
              </p>
              <p>
                <strong>Ambassador Price:</strong> ${variant.prices.ambassadorPrice}
              </p>
              <p>
                <strong>Stylist Price:</strong> ${variant.prices.stylistPrice}
              </p>
              <p>
                <strong>Quantity:</strong> {variant.quantity}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No variants available.</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;

