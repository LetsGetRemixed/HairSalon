import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';
import Products from '../Products/ProductsHome';

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
                <div className="font-cinzel text-3xl ">
                      <Header />
                      
                      <Products />

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
