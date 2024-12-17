import React, { useState, useEffect } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/transaction/transactions`);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Transactions</h1>
      <table>
        <thead>
          <tr><th>Buyer</th><th>Email</th><th>Products</th><th>Amount</th><th>Date</th></tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx._id}>
              <td>{tx.buyerId?.name}</td>
              <td>{tx.buyerId?.email}</td>
              <td>
                {tx.products.map((product, i) => (
                  <div key={i}>
                    {product.category} - Length: {product.length}
                  </div>
                ))}
              </td>
              <td>${tx.totalAmount.toFixed(2)}</td>
              <td>{new Date(tx.purchaseDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
