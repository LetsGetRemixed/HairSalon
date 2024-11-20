import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';

const Home = () => {
  

  return (
    <div>
      <Navbar2 />
      <div className="font-cinzel text-3xl">
        <Header />
        <div className="font-cinzel text-3xl bg-mainBackground py-24">
          <h1>PRODUCTS</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
