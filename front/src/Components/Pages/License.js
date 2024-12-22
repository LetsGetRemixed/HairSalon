import React, { useState } from "react";
import axios from "axios";

const LicenseUpload = () => {
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Please upload a valid image file.");
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setMessage(""); // Clear any previous error message
  };

  // Handle userId input
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!file || !userId) {
      setMessage("Please provide both a file and user ID.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    console.log('Form data is ', formData);
    // Log formData contents for debugging
for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

    setIsLoading(true);
    setMessage(""); // Clear any previous message

    try {
      const response = await axios.post(
        `http://localhost:5100/api/users/upload-license/${userId}`,
        formData,
        
      );

      setMessage(`Upload successful: ${response.data.message}`);
    } catch (error) {
      console.error("Error uploading license:", error);
      setMessage(
        error.response?.data?.error || "Failed to upload license. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Upload License</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="userId">User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            required
            style={{
              display: "block",
              width: "100%",
              padding: "8px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="file">License Image:</label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={{ display: "block", margin: "5px 0" }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: isLoading ? "#cccccc" : "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            borderRadius: "4px",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "10px",
            color: message.toLowerCase().includes("success") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default LicenseUpload;