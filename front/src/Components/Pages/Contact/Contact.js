import React from 'react';
import Navbar from '../Universal/Navbar2';
import Footer from '../Universal/Footer';

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-cinzel">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center h-[300px] flex items-center justify-center text-white shadow-md"
          style={{
            backgroundImage: "url('/images/banners/cremeBackground.jpeg')", 
          }}
        >
          <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
            <h1 className="text-5xl font-extrabold tracking-wide">
              Contact Bold Hair Co.
            </h1>
            <p className="mt-4 text-lg font-medium">
              We're here to help you with any questions or concerns.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto mt-16 p-10 bg-white shadow-xl rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Experiencing issues or need assistance? We’re always here to help!
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Email Us</h3>
              <p className="text-gray-600">
                For support or inquiries, email us directly at:
              </p>
              <p className="text-xl font-semibold mt-4 text-blue-600 hover:underline">
                <a href="mailto:boldhairco2024@gmail.com">Rachel@boldhairco.com</a>
              </p>
            </div>

            {/* Decorative Call-to-Action */}
            <div className="flex items-center justify-center">
                    <a
                        href="/subscribe"
                        className="text-2xl font-extrabold text-gray-600 bg-gradient-to-r from-[#fbe2a6] via-[#fcebc7] to-[#fbe2a6] bg-opacity-80 rounded-lg shadow-md px-6 py-6 hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        Subscribe Now for Exclusive Deals!
                    </a>
                    </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Our team strives to respond to all inquiries within 1-2 business days. We value your feedback and look forward to assisting you.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;


