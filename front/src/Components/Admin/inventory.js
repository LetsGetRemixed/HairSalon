import React, { useState, useEffect } from "react";
import axios from "axios";
import InventoryTable from "./InventoryTable";
import EditProductForm from "./EditProductForm";
import AddProductForm from "./AddProductForm";
import ViewProductModal from "./ViewProductModal";
import { Link } from "react-router-dom";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({
    category: "",
    productName: "",
    description: "",
    weight: 0,
    variants: [],
    image: null,
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/items/get-all-inventory`
        );
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
    if (variantIndex !== undefined) {
      const updatedVariants = [...formData.variants];
      if (priceField) {
        updatedVariants[variantIndex] = {
          ...updatedVariants[variantIndex],
          prices: {
            ...updatedVariants[variantIndex].prices,
            [priceField]: parseFloat(e.target.value) || 0,
          },
        };
      } else {
        updatedVariants[variantIndex] = {
          ...updatedVariants[variantIndex],
          [field]: e.target.value,
        };
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

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...newProductData.variants];
    if (field.includes(".")) {
      const [nestedField, nestedKey] = field.split(".");
      updatedVariants[index] = {
        ...updatedVariants[index],
        [nestedField]: {
          ...updatedVariants[index][nestedField],
          [nestedKey]: parseFloat(value) || 0,
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

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({});
  };

  const handleViewProduct = async (productId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/items/getItem/${productId}`
      );
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
      {addingProduct ? (
        <AddProductForm
          newProductData={newProductData}
          onInputChange={handleVariantChange}
          onAddVariant={handleAddVariant}
          onRemoveVariant={handleRemoveVariant}
          onAddProduct={handleAddProduct}
          onCancel={() => setAddingProduct(false)}
        />
      ) : editingProduct ? (
        <EditProductForm
          formData={formData}
          onInputChange={handleInputChange}
          onCancelEdit={handleCancelEdit}
          onSaveChanges={handleSaveChanges}
        />
      ) : (
        <>
          <button
            onClick={() => setAddingProduct(true)}
            className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Product
          </button>
          <InventoryTable
            inventory={inventory}
            onViewProduct={handleViewProduct}
            onEditProduct={handleEditProduct}
          />
        </>
      )}
      {viewProduct && (
        <ViewProductModal product={viewProduct} onClose={closeViewModal} />
      )}
    </div>
  );
};

export default Inventory;


