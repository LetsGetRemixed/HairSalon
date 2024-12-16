import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all data on component load
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/all-users`);
        setUsers(usersResponse.data);

        const subs = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscription/get-all-subscriptions`);
        setSubscriptions(subs.data);

        // Fetch transactions
        const transactionsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transaction/transactions`);
        setTransactions(transactionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

     <section>
     <div>
            <h1>Subscriptions</h1>
            {subscriptions.length === 0 ? (
                <p>No subscriptions found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Membership Type</th>
                            <th>Expires At</th>
                            <th>Is Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription) => (
                            <tr key={subscription._id}>
                                <td>{subscription.user?.name || 'N/A'} ({subscription.user?.email || 'N/A'})</td>
                                <td>{subscription.membershipType}</td>
                                <td>{new Date(subscription.expiresAt).toLocaleDateString()}</td>
                                <td>{subscription.isActive ? 'Yes' : 'No'}</td>
                                <td>{subscription.user?._id || 'NA'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
     </section>

      <section>
      <div>
            <h1>Transactions</h1>
            {transactions.length === 0 ? (
                <p>No transactions found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Buyer ID</th>
                            <th>Products</th>
                            <th>Total Quantity</th>
                            <th>Total Amount</th>
                            <th>Shipping Address</th>
                            <th>Purchase Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td>{transaction.buyerId}</td>
                                <td>
                                    {transaction.products.map((product, index) => (
                                        <div key={index}>
                                            <p>Category: {product.category}</p>
                                            <p>Length: {product.length}</p>
                                            <p>Quantity: {product.quantity}</p>
                                            <p>Total: ${product.totalAmount.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </td>
                                <td>{transaction.quantity}</td>
                                <td>${transaction.totalAmount.toFixed(2)}</td>
                                <td>
                                    <p>{transaction.shippingAddress.line1}</p>
                                    {transaction.shippingAddress.line2 && <p>{transaction.shippingAddress.line2}</p>}
                                    <p>{transaction.shippingAddress.city}, {transaction.shippingAddress.state}</p>
                                    <p>{transaction.shippingAddress.postal_code}, {transaction.shippingAddress.country}</p>
                                </td>
                                <td>{new Date(transaction.purchaseDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </section>
    </div>
  );
};

// Handlers (example only)
const handleDeleteUser = async (userId) => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`);
    alert("User deleted!");
    // Refresh the users list
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user.");
  }
};


export default AdminDashboard;