import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("expiresAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [membershipFilter, setMembershipFilter] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/get-all-subscriptions`
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const handleSort = () => {
    const sorted = [...subscriptions].sort((a, b) => {
      if (sortField === "expiresAt") {
        const dateA = new Date(a.expiresAt.split("/").reverse().join("-"));
        const dateB = new Date(b.expiresAt.split("/").reverse().join("-"));
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "membershipType") {
        const typeOrder = { Bronze: 1, Silver: 2, Gold: 3 };
        return sortOrder === "asc"
          ? (typeOrder[a.membershipType] || 4) - (typeOrder[b.membershipType] || 4)
          : (typeOrder[b.membershipType] || 4) - (typeOrder[a.membershipType] || 4);
      }
      return 0;
    });
    return sorted;
  };

  const handleClearFilters = () => {
    setSortField("expiresAt");
    setSortOrder("asc");
    setIsActiveFilter(false);
    setStartDate("");
    setEndDate("");
    setMembershipFilter("");
    setSearchEmail("");
  };

  const filteredSubscriptions = handleSort().filter((sub) => {
    const subDate = new Date(sub.expiresAt.split("/").reverse().join("-"));
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const dateInRange = (!start || subDate >= start) && (!end || subDate <= end);
    const membershipMatch =
      !membershipFilter || sub.membershipType === membershipFilter;
    const emailMatch =
      !searchEmail || sub.user?.email?.toLowerCase().includes(searchEmail.toLowerCase());
    return (!isActiveFilter || sub.isActive) && dateInRange && membershipMatch && emailMatch;
  });

  if (loading)
    return (
      <div className="text-center text-gray-700 font-bold text-lg">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
        <Link
          to="/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="font-semibold text-gray-700">Search by Email:</label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Search by email..."
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">Sort By:</label>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="expiresAt">Expiration Date</option>
            <option value="membershipType">Subscription Type</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Membership:</label>
          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-semibold text-gray-700">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-3 text-right">
          <button
            onClick={handleClearFilters}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 text-left border-b">User</th>
              <th className="px-4 py-2 text-left border-b">Membership</th>
              <th className="px-4 py-2 text-left border-b">Expires</th>
              <th className="px-4 py-2 text-left border-b">Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-gray-600">
                  {sub.user?.name || "N/A"}{" "}
                  <span className="text-sm text-gray-500">
                    ({sub.user?.email || "N/A"})
                  </span>
                </td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {sub.membershipType}
                </td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {new Date(
                    sub.expiresAt.split("/").reverse().join("-")
                  ).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      sub.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {sub.isActive ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;






