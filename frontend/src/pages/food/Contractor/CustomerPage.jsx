import React, { useState, useEffect } from 'react';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import { FiSearch } from 'react-icons/fi';

const CustomerPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/customers');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch customers');
        }
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch customers');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.cuNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* NavBar stays fixed at top */}
      <NavBar toggleSidebar={toggleSidebar} />

      {/* Sidebar - fixed to the left */}
      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      {/* Main Content */}
      <div className={`transition-all duration-300 p-6 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          Customer Management
        </h1>

        {/* Search Bar */}
        <div className="flex-grow flex justify-center mb-4 mx-4">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="relative overflow-x-auto shadow-md rounded-lg" style={{ height: 'calc(100vh - 220px)' }}>
          {loading ? (
            <div className="text-center p-4 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center p-4 text-gray-400">No customers found</div>
          ) : (
            <div className="inline-block min-w-full align-middle h-full">
              <div className="overflow-hidden h-full">
                <table className="min-w-full table-fixed divide-y divide-gray-600 bg-gray-700">
                  <thead className="bg-gray-700 sticky top-0 z-10">
                    <tr>
                      <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">CU Number</th>
                      <th className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">Name</th>
                      <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Department</th>
                      <th className="w-64 px-4 py-3 text-center text-sm font-semibold text-white">Main Address</th>
                      <th className="w-64 px-4 py-3 text-center text-sm font-semibold text-white">Invoice Address</th>
                      <th className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">Main Email</th>
                      <th className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">Invoice Email</th>
                      <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Company Size</th>
                    </tr>
                  </thead>
                </table>

                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                  <table className="min-w-full table-fixed divide-y divide-gray-600 bg-gray-700">
                    <tbody className="divide-y divide-gray-600">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-500">
                          <td className="w-32 px-4 py-3 text-center whitespace-nowrap text-white">{customer.cuNo}</td>
                          <td className="w-48 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{customer.name}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{customer.department}</td>
                          <td className="w-64 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{customer.address.mainAddress}</td>
                          <td className="w-64 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{customer.address.invoiceAddress}</td>
                          <td className="w-48 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{customer.email.mainEmail}</td>
                          <td className="w-48 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{customer.email.invoiceEmail}</td>
                          <td className="w-32 px-4 py-3 text-center text-white">{customer.companySize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage; 