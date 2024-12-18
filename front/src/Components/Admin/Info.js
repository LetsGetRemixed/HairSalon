import React from 'react';
import { Link } from 'react-router-dom';

const Info = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Site Information</h1>
        <Link
          to="/admin"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Back to Dashboard
        </Link>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How This Site Works</h2>
        
        <p className="text-gray-700 mb-4">
          Welcome to the admin panel! This site has been designed to help you manage your business efficiently by offering tools to handle users, subscriptions, transactions, and product inventory. Below is an overview of how the site functions and what each section is responsible for:
        </p>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">1. User Management</h3>
          <p className="text-gray-700">
            The <strong>Users</strong> section allows you to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>View all registered users.</li>
            <li>Search users by name, email, or phone number.</li>
            <li>Delete users if necessary.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">2. Subscriptions</h3>
          <p className="text-gray-700">
            The <strong>Subscriptions</strong> section allows you to manage user memberships. Here you can:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>View all active and inactive subscriptions.</li>
            <li>Filter subscriptions by status (e.g., active, expired) or select the type (e.g., Default, Ambassador, Stylist).</li>
            <li>Sort by expiration dates or subscription type.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">3. Transactions</h3>
          <p className="text-gray-700">
            The <strong>Transactions</strong> section helps you track all purchases made on the site. Here you can:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>View detailed transaction history including buyer details, products purchased, and amounts.</li>
            <li>Filter transactions by buyer name, email, or date range.</li>
            <li>Analyze financial performance with a transaction graph for specific time periods (e.g., last month, last year).</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">4. Product Inventory</h3>
          <p className="text-gray-700">
            The <strong>Product Inventory</strong> section provides tools to manage your products. In this section, you can:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>View all products along with their details like name, category, weight, and prices.</li>
            <li>Edit product details such as prices, quantities, and descriptions.</li>
            <li>Update variants for products, including length, weight, and pricing tiers.</li>
            <li>Track inventory levels to ensure product availability.</li>
            <li>Create, or delete products as needed.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">5. Security Features</h3>
          <p className="text-gray-700">
            The site includes robust security measures to ensure your data is safe. Key features include:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>Encrypted user information to prevent unauthorized access.</li>
            <li>Role-based access for admin users only.</li>
            <li>Secure password storage using industry-standard encryption.</li>
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">6. Reporting and Analytics</h3>
          <p className="text-gray-700">
            The admin dashboard includes tools to help you analyze data and performance, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2">
            <li>Graphs and charts for transaction trends.</li>
            <li>Subscription reports to identify active and lapsed memberships.</li>
            <li>Inventory insights to track stock levels and restocking needs.</li>
          </ul>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h4 className="text-lg font-bold text-gray-800">Need Help?</h4>
          <p className="text-gray-700 mt-2">
            If you encounter any issues or need assistance, please reach out to us without hesitation. You can contact us via email colbyperson@cjpweb.com or give me a text at 512-786-5133.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
