import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/items/get-all-inventory`);
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleEditProduct = (product) => {
    setEditingProduct(product._id);
    setFormData({ ...product });
  };

  const handleInputChange = (e, variantIndex, field, priceField) => {
    if (variantIndex !== undefined && field) {
      const updatedVariants = [...formData.variants];
      if (priceField) {
        updatedVariants[variantIndex].prices[priceField] = e.target.value;
      } else {
        updatedVariants[variantIndex][field] = e.target.value;
      }
      setFormData((prev) => ({ ...prev, variants: updatedVariants }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/items/update-inventory/${editingProduct}`,
        formData
      );
      setInventory((prev) =>
        prev.map((item) => (item._id === editingProduct ? formData : item))
      );
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({});
  };

  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/items/getItem/${productId}`);
      setViewProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const closeViewModal = () => {
    setViewProduct(null);
  };

  if (loading)
    return <div className="text-center text-gray-700 font-bold text-lg">Loading...</div>;

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <Link
          to="/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Back to Admin Dashboard
        </Link>
      </div>

      {editingProduct ? (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Edit Product</h2>
          <form>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Product Name:</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full mt-1 border rounded px-2 py-1"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Category:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full mt-1 border rounded px-2 py-1"
              >
                <option value="Blonde">Blonde</option>
                <option value="Dark">Dark</option>
                <option value="Mix">Mix</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full mt-1 border rounded px-2 py-1"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700">Weight (lbs):</label>
              <input
                type="number"
                name="weight"
                value={formData.weight || ""}
                onChange={handleInputChange}
                className="w-full mt-1 border rounded px-2 py-1"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-700 mb-4">Variants</h3>
            {formData.variants?.map((variant, index) => (
              <div key={index} className="mb-6">
                <h4 className="font-semibold text-gray-700">Variant {index + 1}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Length:</label>
                    <input
                      type="text"
                      value={variant.length}
                      onChange={(e) => handleInputChange(e, index, "length")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Wefts Per Pack:</label>
                    <input
                      type="number"
                      value={variant.weftsPerPack}
                      onChange={(e) => handleInputChange(e, index, "weftsPerPack")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Retail Price:</label>
                    <input
                      type="number"
                      value={variant.prices.suggestedRetailPrice}
                      onChange={(e) => handleInputChange(e, index, null, "suggestedRetailPrice")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Ambassador Price:</label>
                    <input
                      type="number"
                      value={variant.prices.ambassadorPrice}
                      onChange={(e) => handleInputChange(e, index, null, "ambassadorPrice")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Stylist Price:</label>
                    <input
                      type="number"
                      value={variant.prices.stylistPrice}
                      onChange={(e) => handleInputChange(e, index, null, "stylistPrice")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => handleInputChange(e, index, "quantity")}
                      className="w-full mt-1 border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 text-left border-b">Product Name</th>
                <th className="px-4 py-2 text-left border-b">Category</th>
                <th className="px-4 py-2 text-left border-b">Weight (lbs)</th>
                <th className="px-4 py-2 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((product) => (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 border-b">{product.productName}</td>
                  <td className="px-4 py-2 border-b">{product.category}</td>
                  <td className="px-4 py-2 border-b">{product.weight || "N/A"}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleViewProduct(product._id)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded mr-2"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{viewProduct.productName}</h2>
            <p className="text-gray-700 mb-2">
              <strong>Category:</strong> {viewProduct.category}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Description:</strong> {viewProduct.description || "N/A"}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Weight:</strong> {viewProduct.weight || "N/A"} lbs
            </p>
            <h3 className="text-lg font-bold text-gray-700 mb-2">Variants:</h3>
            {viewProduct.variants.map((variant, index) => (
              <div key={index} className="border rounded p-2 mb-2">
                <p><strong>Length:</strong> {variant.length}</p>
                <p><strong>Wefts Per Pack:</strong> {variant.weftsPerPack}</p>
                <p><strong>Retail Price:</strong> ${variant.prices.suggestedRetailPrice}</p>
                <p><strong>Ambassador Price:</strong> ${variant.prices.ambassadorPrice}</p>
                <p><strong>Stylist Price:</strong> ${variant.prices.stylistPrice}</p>
                <p><strong>Quantity:</strong> {variant.quantity}</p>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={closeViewModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;



