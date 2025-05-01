import React, { useState, useEffect } from 'react';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import TotIncome from '../Contractor/TotIncome';
import TotIncomeLKR from '../Contractor/TotIncomeLKR';
import { useNavigate } from 'react-router-dom';

const IncomeStatus = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5005/api/contractor/readContract");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (currency) => {
    setSelectedCurrency(currency);
    setShowDetails(true);
  };

  const handleClose = () => {
    setShowDetails(false);
    setSelectedCurrency(null);
  };

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
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </button>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          Income Status
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 mx-auto w-full max-w-6xl">
          {/* Total Income USD */}
          <div 
            onClick={() => handleCardClick('USD')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <TotIncome contracts={contracts} />
          </div>

          {/* Total Income LKR */}
          <div 
            onClick={() => handleCardClick('LKR')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <TotIncomeLKR contracts={contracts} />
          </div>
        </div>

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedCurrency === 'USD' ? 'USD Income Details' : 'LKR Income Details'}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Contract ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {contracts.map((contract) => (
                      <tr key={contract._id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {contract.customId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {contract.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            contract.status === 'Approved' ? 'bg-green-200 text-green-800' :
                            contract.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                            'bg-yellow-200 text-yellow-800'
                          }`}>
                            {contract.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {selectedCurrency === 'USD' 
                            ? `$${contract.totalCost}`
                            : `LKR ${contract.totalCostLKR}`
                          }
                        </td>
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
  );
};

export default IncomeStatus;
