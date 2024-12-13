import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white text-secondText border-t font-cinzel border-black py-8">
      <div className="container mx-auto px-4">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/hairLogo.png" // Replace with your logo path
              alt="Company Logo"
              className="h-12 mb-2"
            />
            <p className="text-sm mt-2">&copy; 2023 Bold Hair & Co.</p>
            <p className="text-sm">All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:justify-center md:space-x-8">
            <Link to="/" className="text-sm hover:text-gray-400">Home</Link>
            <Link to="/#products" className="text-sm hover:text-gray-400">Products</Link>
            <Link to="/about" className="text-sm hover:text-gray-400">About</Link>
            <Link to="/contact" className="text-sm hover:text-gray-400">Contact</Link>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right mt-11">
            <p className="text-sm">Email: support@yourcompany.com</p>
            <p className="text-sm">Phone: +1 (123) 456-7890</p>
          </div>

        </div>

        {/* Bottom Section: Terms and Privacy Links */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <Link to="/terms" className="text-sm hover:text-gray-400 mr-4">Terms of Service</Link>
          <Link to="/privacy" className="text-sm hover:text-gray-400">Privacy Policy</Link>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;




