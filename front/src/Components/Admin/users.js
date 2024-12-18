import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/all-users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/${userToDelete}`);
      setUsers(users.filter((user) => user._id !== userToDelete));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userToDelete));
      setShowModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Apply filters
    const filtered = users.filter((user) => {
      const matchesName = user.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchesEmail = user.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchesPhone = user.phone?.toLowerCase().includes(filters.phone.toLowerCase());
      return matchesName && matchesEmail && matchesPhone;
    });

    setFilteredUsers(filtered);
  };

  const handleClearFilters = () => {
    setFilters({ name: "", email: "", phone: "" });
    setFilteredUsers(users);
  };

  if (loading) return <div className="text-center text-gray-700 font-bold text-lg">Loading...</div>;

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users List</h1>
        <Link
          to="/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold text-gray-700">Search by Name:</label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
            placeholder="Enter name"
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Search by Email:</label>
          <input
            type="text"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
            placeholder="Enter email"
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Search by Phone:</label>
          <input
            type="text"
            name="phone"
            value={filters.phone}
            onChange={handleFilterChange}
            placeholder="Enter phone"
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="text-right mb-6">
        <button
          onClick={handleClearFilters}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-300"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
              <th className="px-4 py-2 text-left border-b">Phone</th>
              <th className="px-4 py-2 text-left border-b">Address</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-gray-600">{user.name}</td>
                <td className="px-4 py-2 border-b text-gray-600">{user.email}</td>
                <td className="px-4 py-2 border-b text-gray-600">{user.phone || 'N/A'}</td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {user.address ? (
                    <div>
                      <p>{user.address.street}</p>
                      <p>{user.address.city}, {user.address.state} {user.address.zip}</p>
                    </div>
                  ) : 'N/A'}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => openDeleteModal(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition duration-300"
                  >
                    Remove User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Account Removal</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Yes, Remove User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;






