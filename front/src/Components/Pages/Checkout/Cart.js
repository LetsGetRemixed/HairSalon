import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-center">Your Cart is Empty</h1>
        <Link to="/" className="text-blue-500 hover:underline text-center block mt-4">
          Go back to shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b py-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p>Length: {item.length}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-between">
        <button
          onClick={clearCart}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Cart
        </button>
        <Link to="/checkout" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart;
