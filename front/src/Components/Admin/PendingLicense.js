import React, { useState, useEffect } from "react";
import axios from "axios";

const PendingLicense = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users with pending licenses
  useEffect(() => {
    const fetchPendingLicenses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/all-users`
        );
        const usersWithPendingLicense = response.data.filter(
          (user) => user.license === "Pending"
        );
        setPendingUsers(usersWithPendingLicense);
      } catch (err) {
        console.error("Error fetching pending licenses:", err);
        setError("Failed to load pending licenses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingLicenses();
  }, []);

  // Approve License
  const handleApprove = async (userId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/update-user-info/${userId}`,
        { license: "Approved" }
      );
      setPendingUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
      alert("License approved successfully!");
    } catch (err) {
      console.error("Error approving license:", err);
      alert("Failed to approve the license. Please try again.");
    }
  };

  // Reject License
  const handleReject = async (userId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/users/update-user-info/${userId}`,
        { license: "Not Approved" }
      );
      setPendingUsers((prev) =>
        prev.filter((user) => user._id !== userId)
      );
      alert("License rejected successfully!");
    } catch (err) {
      console.error("Error rejecting license:", err);
      alert("Failed to reject the license. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading pending licenses...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Licenses</h1>
      {pendingUsers.length === 0 ? (
        <p>No pending licenses at the moment.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">License File</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  <a
                    href={`${process.env.REACT_APP_BACKEND_URL}/users/get-user-license/${user._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View License
                  </a>
                </td>
                <td className="border border-gray-300 p-2 flex space-x-2">
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingLicense;
