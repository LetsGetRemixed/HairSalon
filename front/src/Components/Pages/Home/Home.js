import React from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';
import Products from '../Products/ProductsHome';
import SubscriptionHome from '../Sucbription/SubscriptionHome';

const Home = () => {

  return (
    <div>
      <Navbar2 />
                <div className="font-cinzel text-3xl ">
                      <Header />
                      <SubscriptionHome />
                      <Products />

                </div>
      <Footer />
    </div>
  );
};

export default Home;
