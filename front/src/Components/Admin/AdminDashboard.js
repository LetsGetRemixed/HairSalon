import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const sections = [
    { title: 'Users', icon: '👤', route: '/admin/users' },
    { title: 'Subscriptions', icon: '\uD83D\uDCB3', route: '/admin/subscriptions' },
    { title: 'Transactions', icon: '\uD83D\uDCB8', route: '/admin/transactions' },
    { title: 'Product Inventory', icon: '\uD83D\uDED2', route: '/admin/inventory' },
    { title: 'Info', icon: 'ℹ️', route: '/admin/info' }, // New Info section
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 p-6">
      {/* Dashboard Header */}
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <Link
          to="/"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
        >
          Back to Website
        </Link>
      </header>

      {/* Section Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition duration-300"
          >
            <div className="text-6xl mb-4 text-blue-500">{section.icon}</div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              {section.title}
            </h2>
            <Link
              to={section.route}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              View {section.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;


