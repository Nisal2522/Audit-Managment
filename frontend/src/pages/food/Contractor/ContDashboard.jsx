import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import React, { useState, useEffect } from 'react';
import TotIncome from '../Contractor/TotIncome';
import TotIncomeLKR from '../Contractor/TotIncomeLKR';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContDashboard = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [pendingAudits, setPendingAudits] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: ''
  });

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  // Navigation handlers
  const handleContractsClick = () => {
    navigate('/ContractStatus');
  };

  const handlePendingClick = () => {
    navigate('/PendingContracts');
  };

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime({
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString()
      });
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contracts using axios
        const contractResponse = await axios.get("http://localhost:5005/api/contractor/readContract");
        console.log('Raw Contract Response:', contractResponse);
        
        if (contractResponse.data) {
          // Process the contracts to ensure numeric values
          const processedContracts = contractResponse.data.map(contract => ({
            ...contract,
            totalCost: Number(contract.totalCost || 0),
            totalCostLKR: Number(contract.totalCostLKR || 0),
            manDayCost: Number(contract.manDayCost || 0),
            offerDays: Number(contract.offerDays || 0),
            status: contract.status || "Pending"
          }));

          console.log('Processed Contracts:', processedContracts);
          console.log('Approved Contracts:', processedContracts.filter(c => c.status === "Approved"));
          console.log('Contract Statuses:', processedContracts.map(c => ({ id: c.customId, status: c.status })));
          
          setContracts(processedContracts);
        }

        // Fetch pending audits
        const auditsResponse = await axios.get('http://localhost:5005/api/planneraudits');
        if (auditsResponse.data?.success) {
          const contractCustomIds = new Set((contractResponse.data || []).map(contract => contract.customId));
          
          // Filter only pending and in progress audits that don't have contracts
          const pendingAudits = auditsResponse.data.data.filter(audit => 
            (audit.auditStatus === 'Pending' || audit.auditStatus === 'In Progress') &&
            !contractCustomIds.has(audit.customId)
          );
          setPendingAudits(pendingAudits);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        console.error('Error details:', error.response?.data);
      }
    };

    fetchData();
    // Fetch data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
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
      <div className={`transition-all duration-300 p-6 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Total Contracts Created - Clickable */}
          <div 
            onClick={handleContractsClick}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <h3 className="text-lg font-semibold mb-2 text-center">Total Contracts Created</h3>
            <p className="text-4xl font-bold text-center text-blue-500">{contracts.length}</p>
          </div>
        
          {/* Remaining Contracts - Clickable */}
          <div 
            onClick={handlePendingClick}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <h3 className="text-lg font-semibold mb-2 text-center">Remaining Contracts</h3>
            <p className="text-4xl font-bold text-center text-orange-500">{pendingAudits.length}</p>
          </div>

          {/* Approved Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Approved Contracts</h3>
            <p className="text-4xl font-bold text-center text-green-500">
              {contracts.filter(contract => contract.status === "Approved").length}
            </p>
          </div>

          {/* Rejected Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Rejected Contracts</h3>
            <p className="text-4xl font-bold text-center text-red-500">
              {contracts.filter(contract => contract.status === "Rejected").length}
            </p>
          </div>

          {/* Total Income USD */}
          <div 
            onClick={() => navigate('/IncomeStatus')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <TotIncome contracts={contracts} />
          </div>
          
          {/* Total Income LKR */}
          <div 
            onClick={() => navigate('/IncomeStatus')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gray-600"
          >
            <TotIncomeLKR contracts={contracts} />
          </div>

          {/* Date and Time */}
          <div className="bg-gray-700 p-6 rounded-lg md:col-span-2">
            <p className="text-3xl font-semibold text-center">{currentDateTime.date}</p>
            <p className="text-2xl font-bold text-center text-green-200">{currentDateTime.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContDashboard;
