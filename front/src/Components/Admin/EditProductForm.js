import React from "react";

const EditProductForm = ({ formData, onInputChange, onCancelEdit, onSaveChanges }) => {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Edit Product</h2>
      <form>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => onInputChange(e)}
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
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Weight (lbs):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ""}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-4">Variants</h3>
        {formData.variants?.map((variant, index) => (
          <div key={index} className="mb-6 border p-4 rounded">
            <h4 className="font-semibold text-gray-700">Variant {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Length:</label>
                <input
                  type="text"
                  value={variant.length}
                  onChange={(e) => onInputChange(e, index, "length")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Wefts Per Pack:</label>
                <input
                  type="number"
                  value={variant.weftsPerPack}
                  onChange={(e) => onInputChange(e, index, "weftsPerPack")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Retail Price:</label>
                <input
                  type="number"
                  value={variant.prices.suggestedRetailPrice}
                  onChange={(e) => onInputChange(e, index, null, "suggestedRetailPrice")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Ambassador Price:</label>
                <input
                  type="number"
                  value={variant.prices.ambassadorPrice}
                  onChange={(e) => onInputChange(e, index, null, "ambassadorPrice")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Stylist Price:</label>
                <input
                  type="number"
                  value={variant.prices.stylistPrice}
                  onChange={(e) => onInputChange(e, index, null, "stylistPrice")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block text-gray-700">Quantity:</label>
                <input
                  type="number"
                  value={variant.quantity}
                  onChange={(e) => onInputChange(e, index, "quantity")}
                  className="w-full mt-1 border rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;
