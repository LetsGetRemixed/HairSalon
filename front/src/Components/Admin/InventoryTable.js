import React from "react";

const InventoryTable = ({ inventory, onViewProduct, onEditProduct }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 text-left border-b">Product Name</th>
            <th className="px-4 py-2 text-left border-b">Category</th>
            <th className="px-4 py-2 text-left border-b">Weight (lbs)</th>
            <th className="px-4 py-2 text-left border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{product.productName}</td>
              <td className="px-4 py-2 border-b">{product.category}</td>
              <td className="px-4 py-2 border-b">{product.weight || "N/A"}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => onViewProduct(product._id)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded mr-2"
                >
                  View Details
                </button>
                <button
                  onClick={() => onEditProduct(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
