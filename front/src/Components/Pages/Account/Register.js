import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';
import { AuthContext } from './AuthContext'; // Import your AuthContext or equivalent

const Register = () => {
  const { setUser } = useContext(AuthContext); // Access the AuthContext
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); // Use a boolean for success

  useEffect(() => {
    // Redirect automatically if registration is successful
    if (success) {
      document.querySelector("#autoRedirect").click();
    }
  }, [success]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate phone number format
    if (name === 'phone') {
      const formattedPhone = value
        .replace(/\D/g, '') // Remove non-numeric characters
        .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
        .slice(0, 14); // Limit to (###) ###-####
      setFormData({ ...formData, phone: formattedPhone });
    } 
    // Validate zip code
    else if (name === 'zip') {
      const formattedZip = value.replace(/\D/g, '').slice(0, 9); // Restrict to digits only, max length 9
      setFormData({ ...formData, zip: formattedZip });
    } 
    // Validate other fields
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePassword = (password) => {
    // Password must have at least 8 characters and include at least one number
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        'Password must be at least 8 characters long and include at least one number.'
      );
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
      };

      // Register the user
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, payload);

      // Auto-login after registration
      const loginResponse = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save user to context and/or localStorage
      const userData = loginResponse.data;
      setUser(userData); // Update AuthContext
      localStorage.setItem('authUser', JSON.stringify(userData)); // Optional: persist user in localStorage

      setSuccess(true); // Show success message
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-md mx-auto my-20 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
          <form onSubmit={handleRegister}>
            {/* Form Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
              {formData.password && !validatePassword(formData.password) && (
                <p className="text-red-500 text-sm mt-1">
                  Password must be at least 8 characters long and include at least one number.
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {/* Additional Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="(###) ###-####"
                required
              />
            </div>
            {/* Address Fields */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Street</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select State</option>
                {[
                  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
                  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
                  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
                  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
                  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Zip</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800"
            >
              Register
            </button>
          </form>
        
        {/* Auto Redirect */}
        <Link id="autoRedirect" to="/" />
      </div>

      <Footer />
    </div>
  );
};

export default Register;




