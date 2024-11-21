import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home/Home';
import About from './Components/Pages/About/About';
import Checkout from './Components/Pages/Checkout/Checkout';
import SingleProduct from './Components/Pages/Products/SingleProduct';
import Login from './Components/Pages/Account/Login';
import Register from './Components/Pages/Account/Register';
import Account from './Components/Pages/Account/Account';
import { AuthProvider } from './Components/Pages/Account/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path="/product/:id" element={<SingleProduct />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}
export default App;

