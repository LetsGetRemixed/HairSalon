import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Account/AuthContext";

const LicenseUpload = () => {
  const { user } = useContext(AuthContext); // Fetch user from AuthContext
  const [file, setFile] = useState(null);
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!file) {
      setMessage("Please provide a valid file.");
      return;
    }

    if (!user?.userId) {
      setMessage("User ID is not available. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true);
    setMessage(""); // Clear any previous message

    try {
      // Upload the license image
      await axios.post(
        `http://localhost:5100/api/users/upload-license/${user.userId}`,
        formData
      );

      // Update the user's subscription status to Pending
      await axios.put(
        `http://localhost:5100/api/users/update-user-info/${user.userId}`,
        { licenseStatus: "Pending" }
      );

      setMessage("Upload successful! Your license is now pending approval.");
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

