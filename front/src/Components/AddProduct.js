import React, { useState } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    category: "",
    productName: "",
    description: "",
    weight: "",
    variants: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    try {
      const data = new FormData();
      data.append("image", image);
      data.append("category", formData.category);
      data.append("productName", formData.productName);
      data.append("description", formData.description);
      data.append("weight", formData.weight);
      data.append("variants", formData.variants); // Ensure this is in JSON string format

      const response = await axios.post("http://localhost:5100/api/items/add-product", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`Product added successfully: ${response.data.product.productName}`);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Failed to add product. Please try again.");
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Blonde">Blonde</option>
            <option value="Dark">Dark</option>
            <option value="Mix">Mix</option>
          </select>
        </div>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Product description"
            required
          />
        </div>
        <div>
          <label>Weight:</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight in kg"
            required
          />
        </div>
        <div>
          <label>Variants (JSON):</label>
          <textarea
            name="variants"
            value={formData.variants}
            onChange={handleChange}
            placeholder='[{"length": "18in", "weftsPerPack": 6, "prices": {"suggestedRetailPrice": 100, "ambassadorPrice": 80, "stylistPrice": 90}, "quantity": 10}]'
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>
        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProductForm;