import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Account/AuthContext";
import Navbar from "../Universal/Navbar2"; // Import Navbar component
import Footer from "../Universal/Footer"; // Import Footer component

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
        `${process.env.REACT_APP_BACKEND_URL}/users/upload-license/${user.userId}`,
        formData
      );

      // Update the user's subscription status to Pending
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/update-user-info/${user.userId}`,
        { license: "Pending" }
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
    <div className="bg-[#faf3e6] min-h-screen flex flex-col">
      <Navbar /> {/* Add Navbar */}
      <div className="flex-grow">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8 mt-8">
          <h2 className="text-3xl font-cinzel font-bold text-center text-[#c29d60] mb-6">
            Upload Your License
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <div>
              <label
                htmlFor="file"
                className="block text-lg font-medium text-[#5f5340] mb-2"
              >
                License Image:
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="block w-full p-2 border border-[#e6d7b8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c29d60]"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg text-white font-bold transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#c29d60] hover:bg-[#b79451]"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-center font-medium ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer /> {/* Add Footer */}
    </div>
  );
};

export default LicenseUpload;


