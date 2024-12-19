import React from "react";

const AddProductForm = ({
  newProductData,
  onInputChange,
  onAddVariant,
  onRemoveVariant,
  onVariantChange,
  onCancelAdd,
  onAddProduct,
}) => {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Product</h2>
      <form>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Category:</label>
          <select
            name="category"
            value={newProductData.category}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          >
            <option value="">Select Category</option>
            <option value="Blonde">Blonde</option>
            <option value="Dark">Dark</option>
            <option value="Mix">Mix</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Product Name:</label>
          <input
            type="text"
            name="productName"
            value={newProductData.productName}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Description:</label>
          <textarea
            name="description"
            value={newProductData.description}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Weight (lbs):</label>
          <input
            type="number"
            name="weight"
            value={newProductData.weight}
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Image:</label>
          <input
            type="file"
            name="image"
            onChange={(e) => onInputChange(e)}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-4">Variants</h3>
        {newProductData.variants.map((variant, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Length"
                value={variant.length}
                onChange={(e) => onVariantChange(index, "length", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Wefts Per Pack"
                value={variant.weftsPerPack}
                onChange={(e) => onVariantChange(index, "weftsPerPack", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Retail Price"
                value={variant.prices.suggestedRetailPrice}
                onChange={(e) => onVariantChange(index, "prices.suggestedRetailPrice", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Ambassador Price"
                value={variant.prices.ambassadorPrice}
                onChange={(e) => onVariantChange(index, "prices.ambassadorPrice", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Stylist Price"
                value={variant.prices.stylistPrice}
                onChange={(e) => onVariantChange(index, "prices.stylistPrice", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={variant.quantity}
                onChange={(e) => onVariantChange(index, "quantity", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveVariant(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded mt-2"
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddVariant}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          Add Variant
        </button>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={onCancelAdd}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onAddProduct}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
