import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home/Home';
import About from './Components/Pages/About/About';
import Checkout from './Components/Pages/Checkout/Checkout';
import SingleProduct from './Components/Pages/Products/SingleProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path="/product/:id" element={<SingleProduct />} />
      </Routes>
    </Router>
  );
}
export default App;

