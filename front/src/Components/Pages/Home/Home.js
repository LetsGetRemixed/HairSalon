import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from '../Universal/Footer';
import Navbar2 from '../Universal/Navbar2';


const Home = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    // Fetch image URLs from the backend
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:5100/api/images/all-images'); // Adjust to your backend URL
        const data = await response.json();
        setImages(data.images); // Assuming data.images is the array of URLs
        console.log('images are set');
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);
  return (
    <div>

      <Navbar2 />
                <div className="font-cinzel text-3xl ">

                      <Header />
                      <div className="font-cinzel text-3xl bg-mainBackground  py-24">
                         PRODUCTS
                         {images.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Image ${index + 1}`}
          style={{ width: '200px', height: '200px', margin: '10px', objectFit: 'cover' }}
        />
      ))}
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
