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
  const [showUnitWise, setShowUnitWise] = useState(false);
  const [expandedContractId, setExpandedContractId] = useState(null);
  
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
    setShowUnitWise(false);
  };

  const handleClose = () => {
    setShowDetails(false);
    setSelectedCurrency(null);
    setShowUnitWise(false);
  };

  const toggleUnitWise = () => {
    setShowUnitWise(!showUnitWise);
  };

  const handleContractClick = (contractId) => {
    setExpandedContractId(expandedContractId === contractId ? null : contractId);
  };

  // Function to calculate contract-wise income
  const getContractWiseIncome = () => {
    return contracts.reduce((acc, contract) => {
      const contractId = contract.customId || 'Unspecified';
      acc[contractId] = {
        totalUSD: Number(contract.totalCost) || 0,
        totalLKR: Number(contract.totalCostLKR) || 0,
        projectName: contract.projectName,
        unit: contract.unit,
        status: contract.status,
        contract: contract
      };
      return acc;
    }, {});
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
            <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <div className="sticky top-0 left-0 right-0 bg-gray-800 z-20 px-8 pt-8">
                <div className="flex justify-between items-center pb-6 border-b border-gray-700">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCurrency === 'USD' ? 'USD Income Details' : 'LKR Income Details'}
                  </h2>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleUnitWise}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      {showUnitWise ? 'Show All Contracts' : 'Show Contract ID Wise Income'}
                    </button>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-8 pb-8">
                <div className="overflow-x-auto">
                  {!showUnitWise ? (
                    // Regular contracts table
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
                            Unit
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {contract.unit || 'Unspecified'}
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
                  ) : (
                    // Contract-wise income table
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
                            Unit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Income
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-600">
                        {Object.entries(getContractWiseIncome()).map(([contractId, data]) => (
                          <React.Fragment key={contractId}>
                            <tr 
                              className="hover:bg-gray-700 cursor-pointer"
                              onClick={() => handleContractClick(contractId)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {contractId} {expandedContractId === contractId ? '▼' : '▶'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {data.projectName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {data.unit || 'Unspecified'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  data.status === 'Approved' ? 'bg-green-200 text-green-800' :
                                  data.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                                  'bg-yellow-200 text-yellow-800'
                                }`}>
                                  {data.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {selectedCurrency === 'USD'
                                  ? `$${data.totalUSD.toFixed(2)}`
                                  : `LKR ${data.totalLKR.toFixed(2)}`
                                }
                              </td>
                            </tr>
                            {expandedContractId === contractId && (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 bg-gray-750">
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-gray-700 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2">USD Income</h4>
                                        <p className="text-xl font-bold text-blue-400">${data.totalUSD.toFixed(2)}</p>
                                      </div>
                                      <div className="bg-gray-700 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-gray-400 mb-2">LKR Income</h4>
                                        <p className="text-xl font-bold text-green-400">LKR {data.totalLKR.toFixed(2)}</p>
                                      </div>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Contract Details</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-400">Audit Duration</p>
                                          <p className="text-md text-white">{data.contract.auditDuration} days</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-400">Man Day Cost</p>
                                          <p className="text-md text-white">${data.contract.manDayCost}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-400">Start Date</p>
                                          <p className="text-md text-white">{new Date(data.contract.auditStartDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-400">End Date</p>
                                          <p className="text-md text-white">{new Date(data.contract.auditEndDate).toLocaleDateString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bg-gray-700 p-4 rounded-lg">
                                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Unit-wise Income Details</h4>
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-600">
                                          <thead>
                                            <tr>
                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                                                Unit
                                              </th>
                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                                                Location
                                              </th>
                                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">
                                                Program
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">
                                                USD Income
                                              </th>
                                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">
                                                LKR Income
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-600">
                                            <tr className="hover:bg-gray-600">
                                              <td className="px-4 py-2 text-sm text-gray-300">
                                                {data.contract.unit || 'Unspecified'}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-gray-300">
                                                {data.contract.location || 'Unspecified'}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-gray-300">
                                                {data.contract.program || 'Unspecified'}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-right text-blue-400">
                                                ${data.totalUSD.toFixed(2)}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-right text-green-400">
                                                LKR {data.totalLKR.toFixed(2)}
                                              </td>
                                            </tr>
                                            <tr className="bg-gray-700 font-semibold">
                                              <td colSpan="3" className="px-4 py-2 text-sm text-gray-300">
                                                Total
                                              </td>
                                              <td className="px-4 py-2 text-sm text-right text-blue-400">
                                                ${data.totalUSD.toFixed(2)}
                                              </td>
                                              <td className="px-4 py-2 text-sm text-right text-green-400">
                                                LKR {data.totalLKR.toFixed(2)}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeStatus;
