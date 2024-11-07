import React from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';


const Home = () => {
  return (
    <div>

      <Navbar2 />
                <div className="font-cinzel text-3xl ">

                      <Header />
                      <div className="font-cinzel text-3xl bg-mainBackground  py-24">
                         PRODUCTS
                         <div className="font-cinze flex items-center justify-center text-2xl bg-mainBackground py-24">
                          Hair Extensions
                         </div>
                      </div>
                </div>
        <Footer />
    </div>
  );
};
export default Home;
