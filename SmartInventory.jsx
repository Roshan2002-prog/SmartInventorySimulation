import React, { useState, useEffect } from 'react';
import { Package, Plus, Minus, BellRing, XCircle } from 'lucide-react'; // Icons from lucide-react

// Main App component
const App = () => {
  // State to manage the list of products in inventory
  const [products, setProducts] = useState([
    { id: '1A2B3C4D', name: 'Smartwatch Pro', stock: 5, minStock: 2 },
    { id: '5E6F7G8H', name: 'Wireless Earbuds', stock: 10, minStock: 3 },
    { id: '9I0J1K2L', name: 'Portable Charger', stock: 3, minStock: 1 },
    { id: '3M4N5O6P', name: 'Bluetooth Speaker', stock: 1, minStock: 2 },
  ]);

  // State to manage notifications (e.g., low stock alerts)
  const [notifications, setNotifications] = useState([]);
  // State for the RFID UID input field (simulating scan)
  const [rfidInput, setRfidInput] = useState('');

  // Effect to check for low stock and generate notifications
  useEffect(() => {
    const newNotifications = [];
    products.forEach(product => {
      if (product.stock <= product.minStock) {
        newNotifications.push({
          id: product.id,
          message: `${product.name} is low on stock! Current: ${product.stock}. Please restock.`,
          type: 'warning'
        });
      }
    });
    setNotifications(newNotifications);
  }, [products]); // Re-run when products state changes

  // Function to handle taking a product (decrement stock)
  const handleTakeProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId && product.stock > 0
          ? { ...product, stock: product.stock - 1 }
          : product
      )
    );
  };

  // Function to handle restocking a product (increment stock)
  const handleRestockProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: product.stock + 1 }
          : product
      )
    );
  };

  // Function to simulate an RFID scan
  const handleRfidScan = () => {
    const scannedId = rfidInput.trim().toUpperCase();
    const productToTake = products.find(p => p.id === scannedId);

    if (productToTake) {
      handleTakeProduct(scannedId);
      setNotifications(prev => [...prev, { id: Date.now(), message: `${productToTake.name} (UID: ${scannedId}) detected and taken.`, type: 'info' }]);
    } else if (scannedId) {
      setNotifications(prev => [...prev, { id: Date.now(), message: `Unknown RFID Tag: ${scannedId}. No matching product found.`, type: 'error' }]);
    }
    setRfidInput(''); // Clear input after scan attempt
  };

  // Function to dismiss a notification
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-inter text-gray-800 p-4 sm:p-8 flex flex-col items-center">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        `}
      </style>

      {/* Header */}
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 mb-2 rounded-lg p-2">
          <Package className="inline-block mr-3 h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
          Smart Inventory Tracker
        </h1>
        <p className="text-lg text-gray-600">Monitor your product stock in real-time.</p>
      </header>

      {/* RFID Scan Simulation */}
      <section className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md mb-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <BellRing className="mr-2 text-orange-500" /> Simulate RFID Scan
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            placeholder="Enter RFID UID (e.g., 1A2B3C4D)"
            value={rfidInput}
            onChange={(e) => setRfidInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleRfidScan();
            }}
          />
          <button
            onClick={handleRfidScan}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          >
            Scan RFID
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          (Use UIDs like: 1A2B3C4D, 5E6F7G8H, 9I0J1K2L, 3M4N5O6P to test)
        </p>
      </section>

      {/* Notifications Section */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <BellRing className="mr-2 text-red-500" /> Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="bg-white p-4 rounded-xl shadow-sm text-gray-500 text-center border border-gray-200">No new notifications.</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-4 rounded-xl shadow-md transition duration-300 ease-in-out
                  ${notification.type === 'warning' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' :
                     notification.type === 'info' ? 'bg-blue-100 border-blue-400 text-blue-800' :
                     'bg-red-100 border-red-400 text-red-800'}
                  border`}
              >
                <p className="font-medium">{notification.message}</p>
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="ml-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label="Dismiss notification"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product List Section */}
      <section className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <Package className="mr-2 text-green-600" /> Product Inventory
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RFID UID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`font-semibold ${product.stock <= product.minStock ? 'text-red-500' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.minStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleTakeProduct(product.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                        aria-label={`Take one ${product.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRestockProduct(product.id)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                        aria-label={`Restock one ${product.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm text-center">
        <p>&copy; 2025 Smart Inventory Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
