import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthProvider'; // Assuming you have an Auth context

const ProtectedRoute = ({ children }) => {
  const { user } = useAdminAuth(); // Retrieve authentication status from context

  return user ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
