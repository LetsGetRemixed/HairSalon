import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaMedal } from 'react-icons/fa';
import axios from 'axios';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';

const Account = () => {
  const { user, setUser } = useContext(AuthContext);
  const [accountDetails, setAccountDetails] = useState(null);
  const [subscription, setSubscription] = useState(null); // State for subscription
  const navigate = useNavigate();

  // Fetch account details and subscription if the user is logged in
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        if (user) {
          const accountResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${user.userId}`);
          setAccountDetails(accountResponse.data);

          const subscriptionResponse = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
          );
          setSubscription(subscriptionResponse.data || 'Bronze'); // Default to Bronze if no subscription
        }
      } catch (error) {
        console.error('Error fetching account details or subscription:', error);
      }
    };

    fetchAccountDetails();
  }, [user]);

  const handleLogout = () => {
    setUser(null); // Clear user data
    localStorage.removeItem('authToken'); // Clear any stored token
    navigate('/login'); // Redirect to login page
  };

  const handleBackToHome = () => {
    navigate('/'); // Redirect to homepage
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
        <div className="space-y-4">
          <div className="flex items-center">
            <FaUserCircle className="text-gray-600 mr-3" />
            <p><strong>Name:</strong> {accountDetails.name}</p>
          </div>
          <div className="flex items-center">
            <FaEnvelope className="text-gray-600 mr-3" />
            <p><strong>Email:</strong> {accountDetails.email}</p>
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-600 mr-3" />
            <p><strong>Phone:</strong> {accountDetails.phone}</p>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-600 mr-3" />
            <div>
              <p><strong>Street:</strong> {accountDetails.address.street}</p>
              <p><strong>City:</strong> {accountDetails.address.city}</p>
              <p><strong>State:</strong> {accountDetails.address.state}</p>
              <p><strong>Zip:</strong> {accountDetails.address.zip}</p>
            </div>
          </div>
          {/* Subscription Section */}
          {subscription && (
            <div className="flex items-center">
              <FaMedal className="text-yellow-500 mr-3" />
              <p><strong>Subscription:</strong> {subscription}</p>
            </div>
          )}
        </div>
        <div className="mt-6 space-y-4">
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
      <Footer />
    </div>
  );
};

export default Account;


