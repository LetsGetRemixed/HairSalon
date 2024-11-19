import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from "Blonde" category
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/items/getByCategory/Blonde');
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar2 />
      <div className="font-cinzel text-3xl">
        <Header />
        <div className="font-cinzel text-3xl bg-mainBackground py-24">
          <h1>PRODUCTS</h1>
          <div className="font-cinze flex flex-col items-center justify-center text-2xl bg-mainBackground py-24">
            <h2>Hair Extensions</h2>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4">
                  <img
                    src={product.imageUrl}
                    
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <h3 className="mt-4 text-lg">{product.name}</h3>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
