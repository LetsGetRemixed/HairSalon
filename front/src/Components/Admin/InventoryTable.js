import React from "react";

const InventoryTable = ({ inventory, onViewProduct, onEditProduct, onDeleteProduct }) => {
  // Sort the inventory alphabetically by product name
  const sortedInventory = [...inventory].sort((a, b) =>
    a.productName.localeCompare(b.productName)
  );

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse shadow-md rounded-lg overflow-hidden">
        {/* Table Header */}
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold text-sm md:text-base uppercase">
              Product Name
            </th>
            <th className="px-6 py-4 text-left font-semibold text-sm md:text-base uppercase">
              Category
            </th>
            <th className="px-6 py-4 text-left font-semibold text-sm md:text-base uppercase">
              Weight (lbs)
            </th>
            <th className="px-6 py-4 text-left font-semibold text-sm md:text-base uppercase">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {sortedInventory.map((product, index) => (
            <tr
              key={product._id}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              } hover:bg-indigo-50 transition duration-200`}
            >
              <td className="px-6 py-4 text-sm md:text-base font-medium text-gray-700">
                {product.productName}
              </td>
              <td className="px-6 py-4 text-sm md:text-base text-gray-600">
                {product.category}
              </td>
              <td className="px-6 py-4 text-sm md:text-base text-gray-600">
                {product.weight || "N/A"}
              </td>
              <td className="px-6 py-4 flex flex-wrap gap-3">
                <button
                  onClick={() => onViewProduct(product._id)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg shadow transition"
                >
                  View
                </button>
                <button
                  onClick={() => onEditProduct(product)}
                  className="bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg shadow transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(product._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-lg shadow transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-gray-500 text-sm md:text-base">
          Showing {sortedInventory.length} product{sortedInventory.length !== 1 && "s"}
        </p>
      </div>
    </div>
  );
};

export default InventoryTable;


