import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../Account/AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(0);

  const getApplicablePrice = (prices, subscription) => {
    switch (subscription) {
      case 'Ambassador':
        return prices.ambassadorPrice;
      case 'Stylist':
        return prices.stylistPrice;
      default:
        return prices.suggestedRetailPrice;
    }
  };

  const fetchCart = async (subscription) => {
    if (!user) return;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/cart/get-cart/${user.userId}`
      );
  
      const cartWithDetails = await Promise.all(
        response.data.map(async (item) => {
          try {
            const productResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/items/getItem/${item.productId}`
            );
            const product = productResponse.data;
            const selectedVariant = product.variants.find(
              (variant) => variant.length === item.length
            );
            const applicablePrice = getApplicablePrice(selectedVariant.prices, subscription);
  
            return {
              ...item,
              name: product.productName,
              imageUrl: product.imageUrl,
              price: applicablePrice, // Ensure price is calculated correctly here
            };
          } catch (error) {
            console.error('Error fetching product details:', error);
            return item; // Return item without details if fetching fails
          }
        })
      );
  
      setCart(cartWithDetails);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const removeFromCart = async (productId, length) => {
    if (!user) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/cart/remove-from-cart/${user.userId}`,
        { data: { productId } }
      );
      setCart((prevCart) => prevCart.filter((item) => item.productId !== productId && item.length !== length));
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/cart/clear-cart/${user.userId}`);
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const updateCartItemQuantity = async (itemId, length, newQuantity) => {
    if (!user) return;
  
    try {
      // Optimistic update only if necessary
      
  
      // Perform the API call
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cart/update-quantity/${user.userId}`, {
        productId: itemId,
        length,
        newQuantity,
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
  
      // Optional: Revert to the original cart state if API fails
      await fetchCart(user.subscription); // Refetch cart to ensure consistency
    }
  };

  const applyPromoCode = (promoCode) => {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(10); // Example flat discount
      return true;
    }
    return false;
  };

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateTotal = () => calculateSubtotal() - discount;

  useEffect(() => {
    setLoading(false);
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
        applyPromoCode,
        discount,
        calculateSubtotal,
        calculateTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
