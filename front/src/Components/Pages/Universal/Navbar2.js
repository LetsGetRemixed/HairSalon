import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Subscribe Now Bar */}
     

      {/* Navbar */}
      <nav className="bg-gradient-to-r from-white via-mainBackground to-white shadow-md border-b-2 font-cinzel border-black">
        <div className="container mx-auto  border-black px-4 py-2 flex items-center justify-between">
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center">
            <img src="/hairLogo.png" alt="Logo" className="md:h-12 h-14" />
          </Link>

          {/* Center: Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/products" className="text-gray-700 hover:text-gray-900">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-700 hover:text-gray-900">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-700 hover:text-gray-900">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/subscribe" className="text-gray-700 hover:text-gray-900">
                Subscribe
              </Link>
            </li>
          </ul>

          {/* Right Side: Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-900 text-xl" onClick={toggleMenu}>
              <FaBars />
            </button>

            {/* Account and Cart Icons */}
            <Link to="/account" className="hidden md:block text-gray-900 text-xl">
              <FaUserCircle />
            </Link>
            <Link to="/cart" className="text-gray-900 text-xl">
              <FaShoppingCart />
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <ul className="flex flex-col space-y-2 py-4">
              <li>
                <Link
                  to="/products"
                  className="block px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/subscribe"
                  className="block px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="block px-4 text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
