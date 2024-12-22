import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState('Default'); // Default subscription level
  const [selectedPlan, setSelectedPlan] = useState(''); // Holds the user-selected plan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the user's current subscription on mount or when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
          );
          console.log('Fetched subscription:', response.data);
          setSubscription(response.data || 'Default');
        } catch (error) {
          console.error('Error fetching subscription:', error);
          setError('Failed to fetch subscription details.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Update the selected plan
  const selectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Refresh subscription from the backend
  const refreshSubscription = async () => {
    if (user) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
        );
        console.log('Refreshed subscription:', response.data);
        setSubscription(response.data || 'Default');
        setError('');
      } catch (error) {
        console.error('Error refreshing subscription:', error);
        setError('Failed to refresh subscription details.');
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


