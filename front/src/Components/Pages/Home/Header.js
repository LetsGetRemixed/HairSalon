import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Header = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const deals = [
    {
      image: '/images/banners/testhairproducts1.jpg', // Replace with your image path
      title: '30% Off Shampoos',
      description: 'Limited time offer on our best-selling shampoos.',
    },
    {
      image: '/images/banners/testhairproducts2.jpg', // Replace with your image path
      title: 'Buy One Get One Free',
      description: 'On all conditioners this week only!',
    },
    {
      image: '/images/banners/testhairproducts3.jpg', // Replace with your image path
      title: 'Exclusive Styling Kits',
      description: 'Get a free accessory with every styling kit purchase.',
    },
  ];

  return (
    <div className="relative">
      <Slider {...settings}>
        {deals.map((deal, index) => (
          <div key={index} className="w-full h-80 relative">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
              <h2 className="text-3xl font-bold mb-2">{deal.title}</h2>
              <p className="text-lg font-mainfont">{deal.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Header;
