import React, { useState } from "react";
import axios from "axios";

const AddProductForm = ({ setInventory, setAddingProduct }) => {
  const [newProductData, setNewProductData] = useState({
    category: "",
    productName: "",
    description: "",
    weight: 0,
    variants: [],
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProductData.variants];

    if (field.includes(".")) {
      const [nestedField, nestedKey] = field.split(".");
      updatedVariants[index] = {
        ...updatedVariants[index],
        [nestedField]: {
          ...(updatedVariants[index][nestedField] || {}),
          [nestedKey]: value,
        },
      };
    } else {
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    }

    setNewProductData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleAddVariant = () => {
    setNewProductData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          length: "",
          weftsPerPack: "",
          prices: {
            suggestedRetailPrice: "",
            ambassadorPrice: "",
            stylistPrice: "",
          },
          quantity: "",
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...newProductData.variants];
    updatedVariants.splice(index, 1);
    setNewProductData((prev) => ({ ...prev, variants: updatedVariants }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProductData((prev) => ({ ...prev, image: file }));
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("category", newProductData.category);
      formData.append("productName", newProductData.productName);
      formData.append("description", newProductData.description);
      formData.append("weight", newProductData.weight);

      const formattedVariants = newProductData.variants.map((variant) => ({
        length: variant.length,
        weftsPerPack: parseInt(variant.weftsPerPack) || 0,
        quantity: parseInt(variant.quantity) || 0,
        prices: {
          suggestedRetailPrice: parseFloat(variant.prices.suggestedRetailPrice) || 0,
          ambassadorPrice: parseFloat(variant.prices.ambassadorPrice) || 0,
          stylistPrice: parseFloat(variant.prices.stylistPrice) || 0,
        },
      }));

      formData.append("variants", JSON.stringify(formattedVariants));
      formData.append("image", newProductData.image);

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/items/add-product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setInventory((prev) => [...prev, response.data.product]);
      setAddingProduct(false);
      setNewProductData({
        category: "",
        productName: "",
        description: "",
        weight: 0,
        variants: [],
        image: null,
      });

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add New Product</h2>
      <form>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Category:</label>
          <select
            name="category"
            value={newProductData.category}
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Description:</label>
          <textarea
            name="description"
            value={newProductData.description}
            onChange={handleInputChange}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Weight (lbs):</label>
          <input
            type="number"
            name="weight"
            value={newProductData.weight}
            onChange={handleInputChange}
            className="w-full mt-1 border rounded px-2 py-1"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
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
                value={variant.length || ""}
                onChange={(e) => handleVariantChange(index, "length", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Wefts Per Pack"
                value={variant.weftsPerPack || ""}
                onChange={(e) => handleVariantChange(index, "weftsPerPack", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Retail Price"
                value={variant.prices?.suggestedRetailPrice || ""}
                onChange={(e) =>
                  handleVariantChange(index, "prices.suggestedRetailPrice", e.target.value)
                }
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Ambassador Price"
                value={variant.prices?.ambassadorPrice || ""}
                onChange={(e) =>
                  handleVariantChange(index, "prices.ambassadorPrice", e.target.value)
                }
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Stylist Price"
                value={variant.prices?.stylistPrice || ""}
                onChange={(e) =>
                  handleVariantChange(index, "prices.stylistPrice", e.target.value)
                }
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={variant.quantity || ""}
                onChange={(e) => handleVariantChange(index, "quantity", e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded mt-2"
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
        >
          Add Variant
        </button>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={handleAddProduct}
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


