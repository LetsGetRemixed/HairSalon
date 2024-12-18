import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaMedal, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import Navbar from "../Universal/Navbar2";
import Footer from "../Universal/Footer";

const states = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA",
  "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const Account = () => {
  const { user, setUser } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [updatedDetails, setUpdatedDetails] = useState({}); // Holds editable fields
  const [successMessage, setSuccessMessage] = useState(""); // For success notification
  const [errorMessage, setErrorMessage] = useState(""); // For error modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        if (user) {
          const accountResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/users/${user.userId}`
          );
          setAccountDetails(accountResponse.data);
          setUpdatedDetails({
            phone: accountResponse.data.phone || "",
            street: accountResponse.data.address.street || "",
            city: accountResponse.data.address.city || "",
            state: accountResponse.data.address.state || "", // Added state
            zip: accountResponse.data.address.zip || "",
          });

          const subscriptionResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
          );
          setSubscription(subscriptionResponse.data || "Bronze");
        }
      } catch (error) {
        console.error("Error fetching account details or subscription:", error);
      }
    };

    fetchAccountDetails();
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccessMessage(""); // Clear any success message
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        phone: updatedDetails.phone,
        address: {
          street: updatedDetails.street,
          city: updatedDetails.city,
          state: updatedDetails.state, // Include state in the update
          zip: updatedDetails.zip,
        },
      };

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/update-user-info/${user.userId}`,
        updatedData
      );

      setAccountDetails((prev) => ({
        ...prev,
        phone: updatedDetails.phone,
        address: {
          ...prev.address,
          street: updatedDetails.street,
          city: updatedDetails.city,
          state: updatedDetails.state, // Update state in local state
          zip: updatedDetails.zip,
        },
      }));

      setIsEditing(false);
      setSuccessMessage("Your information has been updated successfully!");
    } catch (error) {
      console.error("Error updating user information:", error);
      setErrorMessage("Failed to update information. Please try again.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    navigate("/login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const closeModal = () => {
    setErrorMessage("");
  };

  if (!user) {
    return <p className="text-center mt-10 text-lg">Please log in to view your account.</p>;
  }

  if (!accountDetails) {
    return <p className="text-center mt-10 text-lg">Loading account details...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-lg mx-auto mt-10 p-6 bg-gradient-to-br from-gray-100 via-white to-gray-50 shadow-lg rounded-lg border border-gray-200">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-6xl text-gray-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Account</h2>
          <p className="text-gray-600 text-sm italic mb-6">Manage your account details below</p>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <div className="flex items-center">
            <FaUserCircle className="text-gray-600 mr-3" />
            <p><strong>Name:</strong> {accountDetails.name}</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-600 mr-3" />
            <p><strong>Email:</strong> {accountDetails.email}</p>
          </div>
          {/* Editable Fields */}
          <div className="flex items-center">
            <FaPhone className="text-gray-600 mr-3" />
            {isEditing ? (
              <input
                name="phone"
                value={updatedDetails.phone}
                onChange={handleInputChange}
                className="border rounded px-2 py-1"
              />
            ) : (
              <p><strong>Phone:</strong> {accountDetails.phone}</p>
            )}
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-600 mr-3" />
            <div>
              {isEditing ? (
                <>
                  <input
                    name="street"
                    value={updatedDetails.street}
                    onChange={handleInputChange}
                    placeholder="Street"
                    className="border rounded px-2 py-1 mb-2"
                  />
                  <input
                    name="city"
                    value={updatedDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="border rounded px-2 py-1 mb-2"
                  />
                  <select
                    name="state"
                    value={updatedDetails.state}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 mb-2 w-full"
                  >
                    <option value="" disabled>
                      Select State
                    </option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <input
                    name="zip"
                    value={updatedDetails.zip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="border rounded px-2 py-1"
                  />
                </>
              ) : (
                <>
                  <p><strong>Street:</strong> {accountDetails.address.street}</p>
                  <p><strong>City:</strong> {accountDetails.address.city}</p>
                  <p><strong>State:</strong> {accountDetails.address.state}</p>
                  <p><strong>Zip:</strong> {accountDetails.address.zip}</p>
                </>
              )}
            </div>
          </div>
          {subscription && (
            <div className="flex items-center">
              <FaMedal className="text-yellow-500 mr-3" />
              <p><strong>Subscription:</strong> {subscription}</p>
            </div>
          )}
        </div>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 font-bold mt-4">{successMessage}</p>
        )}

        {/* Buttons */}
        <div className="mt-6 space-y-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveChanges}
                className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex items-center justify-center"
              >
                <FaSave className="mr-2" /> Save Changes
              </button>
              <button
                onClick={handleEditToggle}
                className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEditToggle}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
            >
              <FaEdit className="mr-2" /> Edit Info
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-800 text-white p-2 rounded-md hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-red-500 text-lg font-bold mb-4">Error</h2>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Account;






