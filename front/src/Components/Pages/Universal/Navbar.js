import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Subscribe Now Bar */}
      <div className="bg-gold font-cinzel text-white text-center py-0.5 cursor-pointer border-b border-black bg-accentBackground font-semibold text-sm" onClick={() => window.location.href = '/subscribe'}>
        <div className="overflow-hidden">
          <p className="whitespace-nowrap animate-scroll md:animate-none">
            ✨ Join Bold Hair & Co for Exclusive Deals and VIP Perks – Subscribe Now!
          </p>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-mainBackground shadow-md font-cinzel">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          {/* Left Side: Account Button */}
          <button className="text-gray-700 text-lg md:text-xl">
            <FaUserCircle />
          </button>

          {/* Logo */}
          <div className="flex-grow flex justify-center">
            <img
              src="/hairLogo.png" // Replace with your logo path
              alt="Logo"
              className="md:h-24 h-16" // Reduced height for a more compact look
            />
          </div>

          {/* Right Side: Shopping Cart */}
          <button className="text-gray-700 text-lg md:text-xl">
            <FaShoppingCart />
          </button>
        </div>

        {/* Product Links */}
        <div className="bg-mainBackground border-t border-black font-semibold">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center">
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 focus:outline-none text-sm"
              >
                {isMenuOpen ? 'Close Menu' : 'View Categories'}
              </button>
              <ul className="hidden md:flex justify-center items-center py-1 font-semibold border-y-2 space-x-8">
                <li><Link to="/products" className="text-darkGray hover:text-gold transition">Browse Products</Link></li>
                <li><Link to="/about-us" className="text-darkGray hover:text-gold transition">About Us</Link></li>
                <li><Link to="/contact" className="text-darkGray hover:text-gold transition">Contact</Link></li>
                <li><Link to="/subscribe" className="text-darkGray hover:text-gold transition">Subscription</Link></li>
              </ul>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <ul className="flex flex-col space-y-2 py-2 text-center">
                  <li><Link to="/products" className="block px-4 py-2 text-darkGray hover:text-gold transition">Browse Products</Link></li>
                  <li><Link to="/conditioners" className="block px-4 py-2 text-darkGray hover:text-gold transition">Conditioners</Link></li>
                  <li><Link to="/styling-products" className="block px-4 py-2 text-darkGray hover:text-gold transition">Styling Products</Link></li>
                  <li><Link to="/hair-oils" className="block px-4 py-2 text-darkGray hover:text-gold transition">Hair Oils</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;




