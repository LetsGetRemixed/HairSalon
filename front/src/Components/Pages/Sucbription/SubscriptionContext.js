import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState('Default'); // Default subscription level
  const [licenseStatus, setLicenseStatus] = useState('Pending');
  const [selectedPlan, setSelectedPlan] = useState(''); // Holds the user-selected plan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the user's current subscription and license status on mount or when user changes
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        setLoading(true);
        try {
          // Fetch user details using /:id endpoint
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/users/${user.userId}`
          );
          const userData = response.data;

          // Set subscription and license status
          setSubscription(userData.subscription || 'Default');
          setLicenseStatus(userData.license || 'Pending');

          console.log('Fetched user subscription:', userData.subscription);
          console.log('Fetched user license:', userData.license);

          setError('');
        } catch (error) {
          console.error('Error fetching user details:', error);
          setError('Failed to load user details.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  // Update the selected plan
  const selectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Refresh subscription and license status from the backend
  const refreshSubscription = async () => {
    if (user) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/${user.userId}`
        );
        const userData = response.data;

        // Refresh subscription and license status
        setSubscription(userData.subscription || 'Default');
        setLicenseStatus(userData.license || 'Pending');

        console.log('Refreshed user subscription:', userData.subscription);
        console.log('Refreshed user license:', userData.license);

        setError('');
      } catch (error) {
        console.error('Error refreshing user details:', error);
        setError('Failed to refresh user details.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        setSubscription,
        licenseStatus,
        setLicenseStatus,
        selectedPlan,
        selectPlan,
        refreshSubscription,
        loading,
        error,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Custom hook for using SubscriptionContext
export const useSubscription = () => useContext(SubscriptionContext);




