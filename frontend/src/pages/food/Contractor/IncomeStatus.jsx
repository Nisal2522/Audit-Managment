import React from 'react';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import TotIncome from '../Contractor/TotIncome';
import TotIncomeLKR from '../Contractor/TotIncomeLKR';
import { useState } from 'react';

const IncomeStatus = () => {

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [contracts, setContracts] = useState([]);
  
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
      const data = await response.json(); // Parsing JSON data
      setContracts(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };  
  fetchData();

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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center">
          Income Status
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4 mx-auto w-full max-w-6xl ">
          {/* Total Income  */}
          <TotIncome contracts={contracts} />
          {/* Total Income LKR  */}
          <TotIncomeLKR contracts={contracts} /> 
        </div>
      </div>
    </div>
    
  );
};

export default IncomeStatus;
