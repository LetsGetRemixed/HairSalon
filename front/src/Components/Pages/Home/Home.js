import React from 'react';
import Navbar from '../Universal/Navbar';
import Header from './Header';
import Footer from '../Universal/Footer';

const Home = () => {
  return (
    <div>

    <Navbar />
    <div className="font-mainfont text-3xl ">


          <Header />
          <div class="product">
  <h1>Product Name</h1>
  <p>Description of the product.</p>
  <img src="https://drive.google.com/uc?export=view&id=1VXNuLhv7QLBBjwygVEuoQgrElHFQRudy
" alt="Product Image" />
</div>

    </div>
        <Footer />
    </div>
  );
};
export default Home;
