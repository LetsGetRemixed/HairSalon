import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (user) {
      try {
        console.log('Fetch cart called');
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cart/get-cart/${user.userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  useEffect(() => {
    fetchCart();
    setLoading(false);
  }, [user]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

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
    <CartContext.Provider value={{ cart, setCart, loading, addToCart, removeFromCart, clearCart, fetchCart, updateCartItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);