import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { AuthContext } from './AuthContext';
import axios from 'axios';
import Footer from '../Universal/Footer';
import Navbar from '../Universal/Navbar2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`, 
        { email, password }
      );
      setUser(response.data); // Save user data to context
      navigate('/'); // Redirect to account page
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-md mx-auto my-60 p-6 font-cinzel bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800">
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            Create your free account now!
          </Link>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

