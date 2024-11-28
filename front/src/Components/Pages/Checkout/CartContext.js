import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/cart/${user.userId}`
          );
          setCart(response.data);
        } catch (error) {
          console.error('Error fetching cart:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (user) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/cart/update/${user.userId}`,
          { itemId, quantity }
        );
        setCart(response.data);
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, loading, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
