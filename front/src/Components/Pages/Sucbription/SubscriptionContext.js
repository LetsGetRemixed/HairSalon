import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState('Default'); // Holds the subscription ID
  const [membershipType, setMembershipType] = useState('Default'); // Holds the membership type (e.g., Ambassador, Default)
  const [licenseStatus, setLicenseStatus] = useState('Pending');
  const [nextBillingDate, setNextBillingDate] = useState('null');
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

          // Set subscription (ID) and membershipType (e.g., Ambassador)
          setSubscription(userData.subscription?._id || 'Default');
          setMembershipType(userData.subscription?.membershipType || 'Default');
          setLicenseStatus(userData.license || 'Pending');
          setNextBillingDate(userData.subscription?.expireDate);
        
      

          console.log('Fetched subscription ID:', userData.subscription?._id);
          console.log('Fetched membership type:', userData.subscription?.membershipType);
          console.log('Fetched user license:', userData.license || null);
          

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

        

        // Refresh subscription (ID) and membershipType
        setSubscription(userData.subscription?._id || 'Default');
        setMembershipType(userData.subscription?.membershipType || 'Default');
        setLicenseStatus(userData.license || 'Pending');
        setNextBillingDate(userData.subscription.expireDate);
      
     

        console.log('Refreshed subscription ID:', userData.subscription?._id);
        console.log('Refreshed membership type:', userData.subscription?.membershipType);
        console.log('Refreshed user license:', userData.license);
        console.log('Refreshed next billing date:', nextBillingDate);

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
        subscription, // Subscription ID for general use
        membershipType, // Membership type for specific use cases
        nextBillingDate,
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





