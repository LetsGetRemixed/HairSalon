import React from "react";
import axios from "axios";

const RemoveProduct = ({ productId, onClose, onDelete }) => {
    const handleDelete = async () => {
        console.log("Deleting product with ID:", productId);
        try {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/items/delete-product/${productId}`);
          onDelete(productId); // Notify the parent component (Inventory.js) about the deletion
          alert("Product deleted successfully!");
          onClose(); // Close the modal
        } catch (error) {
          console.error("Error deleting product:", error);
          alert("Failed to delete product. Please try again.");
        }
      };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveProduct;
