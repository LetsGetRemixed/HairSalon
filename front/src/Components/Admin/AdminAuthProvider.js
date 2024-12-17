import React, { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

// Create the authentication context
const AdminAuthContext = createContext();

// AdminAuthProvider Component
export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function: Replace this with real authentication logic
  const login = (username, password) => {
    if (username === '123' && password === '123') { // Example credentials
      setUser({ username });
      localStorage.setItem('user', JSON.stringify({ username }));
      window.location.href = '/admin'; // Redirect to admin dashboard
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/adminlogin'; // Redirect to login
  };

  // Check for saved user in localStorage on load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook to use the AdminAuthContext
export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};
