import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionHome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/subscription'); // Redirect to the subscription page
  };

  return (
    <div
      onClick={handleClick}
      className="w-full cursor-pointer py-4 bg-gradient-to-r from-[#fdf6e3] via-[#fcebc7] to-[#fbe2a6] bg-opacity-80 backdrop-blur-md rounded-md shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <p className="text-lg sm:text-xl font-bold text-gray-700 uppercase tracking-wide">
          Subscribe now for BOLD Deals!
        </p>
      </div>
    </div>
  );
};

export default SubscriptionHome;

