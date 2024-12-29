import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [graphData, setGraphData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("lastMonth");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/transaction/transactions`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const filterTransactionsForGraph = () => {
      const now = new Date();
      let filtered;
      switch (timeFilter) {
        case "lastMonth":
          filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.purchaseDate);
            return (
              txDate.getMonth() === now.getMonth() - 1 &&
              txDate.getFullYear() === now.getFullYear()
            );
          });
          break;
        case "last6Months":
          filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.purchaseDate);
            const sixMonthsAgo = new Date(now);
            sixMonthsAgo.setMonth(now.getMonth() - 6);
            return txDate >= sixMonthsAgo;
          });
          break;
        case "lastFiscalYear":
          filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.purchaseDate);
            const fiscalStart = new Date(now.getFullYear() - 1, 6, 1); // Fiscal year starts July 1
            const fiscalEnd = new Date(now.getFullYear(), 5, 30);
            return txDate >= fiscalStart && txDate <= fiscalEnd;
          });
          break;
        case "yearToDate":
          filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.purchaseDate);
            return txDate.getFullYear() === now.getFullYear();
          });
          break;
        default:
          filtered = transactions;
      }

      const graphData = filtered.map((tx) => ({
        date: new Date(tx.purchaseDate).toLocaleDateString(),
        amount: tx.totalAmount,
      }));

      setGraphData(graphData);
    };

    filterTransactionsForGraph();
  }, [timeFilter, transactions]);

  const handleClearFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setStartDate("");
    setEndDate("");
    setSortOrder("asc");
  };

  const filteredTransactions = transactions
    .filter((tx) => {
      const matchesName = tx.buyerId?.name
        ?.toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesEmail = tx.buyerId?.email
        ?.toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchesDate =
        (!startDate || new Date(tx.purchaseDate) >= new Date(startDate)) &&
        (!endDate || new Date(tx.purchaseDate) <= new Date(endDate));
      return matchesName && matchesEmail && matchesDate;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount;
    });

  if (loading)
    return (
      <div className="text-center text-gray-700 font-bold text-lg mt-8">
        Loading...
      </div>
    );

  const graphLabels = graphData.map((data) => data.date);
  const graphAmounts = graphData.map((data) => data.amount);
  const totalAmount = graphAmounts.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <Link
          to="/admin"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Back to Admin Dashboard
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block font-semibold text-gray-700">Buyer Name:</label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by name"
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Buyer Email:</label>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="Search by email"
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Sort Amount:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Lowest to Highest</option>
            <option value="desc">Highest to Lowest</option>
          </select>
        </div>
      </div>

      <div className="text-right mb-4">
        <button
          onClick={handleClearFilters}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded transition duration-300"
        >
          Clear Filters
        </button>
      </div>


        {/* List Section */}
        <div className="overflow-x-auto pb-8">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="px-4 py-2 border-b text-left">Buyer</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Products</th>
              <th className="px-4 py-2 border-b text-left">Amount</th>
              <th className="px-4 py-2 border-b text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-gray-700">
                  {tx.buyerId?.name || "N/A"}
                </td>
                <td className="px-4 py-2 border-b text-gray-700">
                  {tx.buyerId?.email || "N/A"}
                </td>
                <td className="px-4 py-2 border-b text-gray-700">
                  {tx.products.map((product, i) => (
                    <div key={i} className="mb-1">
                      <span className="font-semibold">
                        {product.name}
                      </span>
                      <span className="ml-2 text-gray-600">
                        - Length: {product.length}
                      </span>
                      <span className="ml-2 text-gray-600">
                        X {product.quantity}
                      </span>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 border-b text-gray-700">
                  ${tx.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border-b text-gray-700">
                  {new Date(tx.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Graph Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Transactions Graph</h2>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Select Time Period:</label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="w-full mt-1 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
          >
            <option value="lastMonth">Last Month</option>
            <option value="last6Months">Last 6 Months</option>
            <option value="lastFiscalYear">Last Fiscal Year</option>
            <option value="yearToDate">Year to Date</option>
          </select>
        </div>
        <Line
          data={{
            labels: graphLabels,
            datasets: [
              {
                label: "Transaction Amounts",
                data: graphAmounts,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: true,
              },
            ],
          }}
        />
        <div className="text-right mt-4 font-semibold text-gray-700">
          Total Amount: ${totalAmount.toFixed(2)}
        </div>
      </div>

     
    </div>
  );
};

export default Transactions;

