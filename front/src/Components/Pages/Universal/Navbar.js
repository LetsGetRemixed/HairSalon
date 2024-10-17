import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left Side: Account Button */}
        <button className="text-gray-700 text-xl">
          <FaUserCircle />
        </button>

        {/* Logo */}
        <div className="flex-grow flex justify-center">
          <img
            src="/logo.png" // Replace with your logo path
            alt="Logo"
            className="h-12"
          />
        </div>

        {/* Right Side: Shopping Cart */}
        <button className="text-gray-700 text-xl">
          <FaShoppingCart />
        </button>
      </div>

      {/* Product Links */}
      <div className="bg-gray-100 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 md:hidden p-2 focus:outline-none"
            >
              {isMenuOpen ? 'Close Menu' : 'Products'}
            </button>
            <ul className="hidden md:flex justify-between items-center space-x-4">
              <li><Link to="/shampoos" className="text-gray-600 hover:text-gray-800">Shampoos</Link></li>
              <li><Link to="/conditioners" className="text-gray-600 hover:text-gray-800">Conditioners</Link></li>
              <li><Link to="/styling-products" className="text-gray-600 hover:text-gray-800">Styling Products</Link></li>
              <li><Link to="/hair-oils" className="text-gray-600 hover:text-gray-800">Hair Oils</Link></li>
              <li><Link to="/accessories" className="text-gray-600 hover:text-gray-800">Accessories</Link></li>
            </ul>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <ul className="flex flex-col space-y-2 py-2">
                <li><Link to="/shampoos" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Shampoos</Link></li>
                <li><Link to="/conditioners" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Conditioners</Link></li>
                <li><Link to="/styling-products" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Styling Products</Link></li>
                <li><Link to="/hair-oils" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Hair Oils</Link></li>
                <li><Link to="/accessories" className="block px-4 py-2 text-gray-600 hover:bg-gray-200">Accessories</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


