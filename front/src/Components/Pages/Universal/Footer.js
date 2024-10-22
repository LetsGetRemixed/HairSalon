import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Company Name */}
          <div className="mb-4 md:mb-0">
            <img
              src="/logo.png" // Replace with your logo path
              alt="Company Logo"
              className="h-12 mb-2"
            />
            <p className="text-sm">&copy; 2024 Your Company Name. All rights reserved.</p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
            <Link to="/" className="hover:text-gray-400">Home</Link>
            <Link to="/products" className="hover:text-gray-400">Products</Link>
            <Link to="/about" className="hover:text-gray-400">About Us</Link>
            <Link to="/contact" className="hover:text-gray-400">Contact</Link>
          </div>

          {/* Contact Information */}
          <div className="text-center md:text-right">
            <p className="text-sm">Email: support@yourcompany.com</p>
            <p className="text-sm">Phone: +1 (123) 456-7890</p>
          </div>
        </div>

        {/* Bottom Links (e.g., Terms, Privacy) */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <Link to="/terms" className="text-sm hover:text-gray-400 mr-4">Terms of Service</Link>
          <Link to="/privacy" className="text-sm hover:text-gray-400">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
