import React from "react";

const ViewProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 focus:outline-none shadow"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {product.productName}
        </h2>

        {/* Scrollable Content */}
        <div className="max-h-[75vh] overflow-y-auto px-4">
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Category:</strong> {product.category}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {product.description || "N/A"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Weight:</strong> {product.weight || "N/A"} lbs
              </p>
            </div>
            {product.imageUrl && (
              <div className="flex justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="rounded-lg shadow-lg max-w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Variants Section */}
          <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">
            Variants
          </h3>
          {product.variants && product.variants.length > 0 ? (
            <div className="space-y-4">
              {product.variants.map((variant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <p className="text-gray-700">
                    <strong>Length:</strong> {variant.length}
                  </p>
                  <p className="text-gray-700">
                    <strong>Wefts Per Pack:</strong> {variant.weftsPerPack}
                  </p>
                  <p className="text-gray-700">
                    <strong>Retail Price:</strong> $
                    {variant.prices.suggestedRetailPrice}
                  </p>
                  <p className="text-gray-700">
                    <strong>Ambassador Price:</strong> $
                    {variant.prices.ambassadorPrice}
                  </p>
                  <p className="text-gray-700">
                    <strong>Stylist Price:</strong> $
                    {variant.prices.stylistPrice}
                  </p>
                  <p className="text-gray-700">
                    <strong>Quantity:</strong> {variant.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No variants available.</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;



