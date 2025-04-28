import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import { FiSearch } from 'react-icons/fi';

const ContractStatus = () => {
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/contractor/readContract");
        const contractsArray = Object.values(response.data);

        if (contractsArray && Array.isArray(contractsArray)) {
          setContracts(contractsArray);
        } else {
          setError("Failed to load contracts. Please try again later.");
        }
      } catch (error) {
        setError("An error occurred while fetching contract data.");
      }
    };

    fetchContracts();
  }, []);

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* NavBar */}
      <NavBar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`transition-all duration-300 p-6 ${
          isSidebarVisible ? "ml-64" : "ml-0"
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
          {/* Total Contracts Created */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Total Contracts Created
            </h3>
            <p className="text-4xl font-bold text-center text-blue-500">
              {contracts.length}
            </p>
          </div>

          {/* Remaining Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Remaining Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-orange-500">6</p>
          </div>

          {/* Approved Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Approved Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-green-500">23</p>
          </div>

          {/* Rejected Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Rejected Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-red-500">2</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
        bg-clip-text text-transparent mb-3 mt-6 text-center">Created Contracts
        </h2>

        <div className="flex-grow flex justify-center mb-5 mx-4">
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Project ID
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Project Name
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Client ID
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Client Name
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Contract Date
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Audit Start Date
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Audit End Date
                </th>
                <th className="px-6 py-3 border-b text-left text-purple-500 text-center">
                  Audit Duration (days)
                </th>
                <th className="px-6 py-3 border-b text-left text-pink-500 text-center">
                  Offer Days
                </th>
                <th className="px-6 py-3 border-b text-left text-white text-center">
                  Man Cost
                </th>
                <th className="px-6 py-3 border-b text-left text-yellow-500 text-center">
                  Total Cost ($)
                </th>
                <th className="px-6 py-3 border-b text-left text-yellow-500 text-center">
                  Total Cost (LKR)
                </th>
              </tr>
            </thead>
          </table>

          {/* Add the scrollable container for the table body */}
          <div
            className="max-h-80 overflow-y-auto block"
            style={{ height: "400px" }} // Adjust the height as per your requirement
          >
            <table className="min-w-full bg-gray-700 border border-gray-300 shadow-md rounded-lg ">
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id} className="hover:bg-gray-500 cursor-pointer">
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white" 
                      >
                        {contract.projectID}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {contract.projectName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {contract.clientID}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {contract.clientName}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {new Date(contract.contractDate).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {new Date(contract.auditStartDate).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {new Date(contract.auditEndDate).toLocaleDateString()}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-purple-200"
                      >
                        {contract.auditDuration}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-pink-200"
                      >
                        {contract.offerDays}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-white"
                      >
                        {contract.manDayCost}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-yellow-200"
                      >
                        {contract.totalCost}
                      </Link>
                    </td>
                    <td className="px-6 py-3 border-b text-center">
                      <Link
                        to={`/updateContract/${contract._id}`}
                        className="block text-yellow-200"
                      >
                        {contract.totalCostLKR}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractStatus;
