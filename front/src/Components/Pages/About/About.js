import React from 'react';
import Navbar2 from '../Universal/Navbar2';
import Footer from '../Universal/Footer';

const About = () => {
  return (
    <div>
        <Navbar2 />
    <div className="container mx-auto px-4 py-12 font-cinzel text-darkGray">
      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center">
        {/* Image */}
        <div className="md:w-1/2 w-full mb-8 md:mb-0">
          <img 
            src="/about-image.jpg" // Replace with your about image path
            alt="About Bold Hair & Co" 
            className="w-full h-auto rounded-md shadow-lg"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full md:pl-8 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-6 text-gold">About Bold Hair & Co</h1>
          <p className="mb-4 text-lg leading-relaxed">
            At Bold Hair & Co, we believe in empowering you to embrace your unique style with confidence. Our premium hair products are crafted with the finest ingredients, designed to bring out the best in every hair type. From luxurious shampoos to styling essentials, each product is created with precision and passion.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Founded with a commitment to quality and elegance, Bold Hair & Co is more than just a brand—it's a promise to help you achieve your hair goals while indulging in the ultimate salon experience at home. Join us in redefining beauty, one strand at a time.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            Discover your style with Bold Hair & Co, and let your hair do the talking.
          </p>
          <button className="mt-4 px-6 py-2 bg-gold text-white rounded-md shadow-md hover:bg-gold-dark transition duration-300 font-semibold">
            Explore Our Products
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default About;
