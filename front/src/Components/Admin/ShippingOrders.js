import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShippingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // For lightbox
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShipped, setShowShipped] = useState(false); // Toggle for shipped/unshipped
  const navigate = useNavigate();

  // Fetch orders based on isShipped status
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transaction/transactions`);
        const filteredOrders = response.data
          .filter(order => order.isShipped === showShipped)
          .sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)); // Sort by purchaseDate
        setOrders(filteredOrders);
        setError('');
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showShipped]);

  // Update the order shipping status
  const handleToggleShipping = async () => {
    if (!selectedOrder) return;

    try {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/transaction/update-transaction/${selectedOrder._id}`;
      await axios.patch(endpoint);
      setOrders((prevOrders) => prevOrders.filter(order => order._id !== selectedOrder._id));
      alert(showShipped ? 'Order marked as not shipped!' : 'Order marked as shipped!');
      setSelectedOrder(null); // Close lightbox
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update the order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Shipping Orders</h1>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Back to Dashboard
        </button>
      </header>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-700 font-semibold">{showShipped ? 'Showing Shipped Orders' : 'Showing Unshipped Orders'}</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showShipped}
            onChange={() => setShowShipped(!showShipped)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
        </label>
      </div>

      {loading && <p className="text-center text-gray-600">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Shipping Address</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Purchase Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-800">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {order.buyerId?.name || 'Unknown'} <br />
                    <span className="text-xs text-gray-500">{order.buyerId?.email}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {order.shippingAddress.line1}, {order.shippingAddress.line2 && `${order.shippingAddress.line2}, `}
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}, {order.shippingAddress.country}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <ul className="list-disc list-inside">
                      {order.products.map((product, index) => (
                        <li key={index}>{product.name} - Qty: {product.quantity}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{order.priority || 'Standard'}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(order.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {showShipped ? 'Mark as Not Shipped' : 'Mark as Shipped'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lightbox for Shipping Actions */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{showShipped ? 'Revert Shipping' : 'Ship Order'}</h2>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Buyer:</strong> {selectedOrder.buyerId?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {selectedOrder.buyerId?.email}</p>
            <p className="mt-4"><strong>Shipping Address:</strong></p>
            <p>
              {selectedOrder.shippingAddress.line1}, {selectedOrder.shippingAddress.line2 && `${selectedOrder.shippingAddress.line2}, `}
              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postal_code}, {selectedOrder.shippingAddress.country}
            </p>
            <p className="mt-4"><strong>Products:</strong></p>
            <ul className="list-disc list-inside">
              {selectedOrder.products.map((product, index) => (
                <li key={index} className="text-gray-700">
                  {product.name} - Qty: {product.quantity}
                </li>
              ))}
            </ul>
            <p className="mt-4"><strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}</p>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleShipping}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {showShipped ? 'Mark as Not Shipped' : 'Mark as Shipped'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingOrders;




