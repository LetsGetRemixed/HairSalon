import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [subscription, setSubscription] = useState('Bronze'); // Default to 'Bronze' if no subscription exists
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/subscription/check-user-subscription/${user.userId}`
          );
          // Ensure response data is valid
          console.log('Fetched subscription:', response.data);
          setSubscription(response.data || 'Bronze');
        } catch (error) {
          console.error('Error fetching subscription:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{ subscription, setSubscription, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);


