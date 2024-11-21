import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Account = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null); // Clear user data
  };

  if (!user) {
    return <p>Please log in to view your account.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">Your Account</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2 rounded-md hover:bg-red-700">
        Logout
      </button>
    </div>
  );
};

export default Account;
