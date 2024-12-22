import React from "react";

const EditProductForm = ({ formData, onInputChange, onCancelEdit, onSaveChanges }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-xl max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
        Edit Product
      </h2>
      <form className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">
            Product Name:
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={(e) => onInputChange(e)}
            className="mt-2 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Category:
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => onInputChange(e)}
            className="mt-2 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Blonde">Blonde</option>
            <option value="Dark">Dark</option>
            <option value="Mix">Mix</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => onInputChange(e)}
            className="mt-2 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows="4"
            placeholder="Enter product description"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">
            Weight (lbs):
          </label>
          <input
            type="number"
            name="weight"
            value={formData.weight || ""}
            onChange={(e) => onInputChange(e)}
            className="mt-2 w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter product weight"
          />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mt-8 border-b pb-4">
          Variants
        </h3>
        {formData.variants?.map((variant, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md space-y-4"
          >
            <h4 className="text-lg font-semibold text-gray-700">
              Variant {index + 1}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">Length:</label>
                <input
                  type="text"
                  value={variant.length}
                  onChange={(e) => onInputChange(e, index, "length")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter length"
                />
              </div>
              <div>
                <label className="block text-gray-700">Wefts Per Pack:</label>
                <input
                  type="number"
                  value={variant.weftsPerPack}
                  onChange={(e) => onInputChange(e, index, "weftsPerPack")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter wefts per pack"
                />
              </div>
              <div>
                <label className="block text-gray-700">Retail Price:</label>
                <input
                  type="number"
                  value={variant.prices.suggestedRetailPrice}
                  onChange={(e) => onInputChange(e, index, null, "suggestedRetailPrice")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter retail price"
                />
              </div>
              <div>
                <label className="block text-gray-700">Ambassador Price:</label>
                <input
                  type="number"
                  value={variant.prices.ambassadorPrice}
                  onChange={(e) => onInputChange(e, index, null, "ambassadorPrice")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter ambassador price"
                />
              </div>
              <div>
                <label className="block text-gray-700">Stylist Price:</label>
                <input
                  type="number"
                  value={variant.prices.stylistPrice}
                  onChange={(e) => onInputChange(e, index, null, "stylistPrice")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter stylist price"
                />
              </div>
              <div>
                <label className="block text-gray-700">Quantity:</label>
                <input
                  type="number"
                  value={variant.quantity}
                  onChange={(e) => onInputChange(e, index, "quantity")}
                  className="w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter quantity"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 shadow-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveChanges}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductForm;

