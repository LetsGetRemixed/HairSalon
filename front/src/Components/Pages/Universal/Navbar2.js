import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars } from 'react-icons/fa';
import { AuthContext } from '../Account/AuthContext';
import { useCart } from '../Checkout/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext); // Access user data from AuthContext
  const { cart, fetchCart } = useCart(); // Access cart data from CartContext
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart(); // Ensure the cart is fetched only if the user is logged in
    }
  }, [user]);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-white via-mainBackground to-white shadow-md border-b-2 font-cinzel border-black">
        <div className="container mx-auto border-black px-4 py-2 flex items-center justify-between">
          {/* Left Side: Logo */}
          <Link to="/" className="flex items-center">
            <img src="/hairLogo.png" alt="Logo" className="md:h-12 h-14" />
          </Link>

          {/* Center: Desktop Menu */}
          <ul className="hidden md:flex space-x-8">
            <li>
              <Link to="/#products" className="text-gray-700 hover:text-gray-900">
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

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={toggleAccountMenu}
                className="text-gray-900 text-xl flex items-center"
              >
                <FaUserCircle />
              </button>
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                  {user ? (
                    <ul>
                      <li>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          My Account
                        </Link>
                      </li>
                      <li>
                        <button
                          className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setUser(null); // Clear user state
                            localStorage.removeItem('authUser'); // Remove token
                            window.location.reload(); // Reload to reset context
                          }}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsAccountMenuOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button onClick={handleCartClick} className="relative text-gray-900 text-xl">
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <ul className="flex flex-col space-y-2 py-4">
              <li>
                <Link
                  to="/#products"
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


