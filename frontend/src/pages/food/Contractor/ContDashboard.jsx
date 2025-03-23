import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import React, { useState, useEffect } from 'react';
import TotIncome from '../Contractor/TotIncome';
import TotIncomeLKR from '../Contractor/TotIncomeLKR';

const ContDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: ''
  });

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

  // Update current date and time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const formattedTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });

      setCurrentDateTime({
        date: formattedDate,
        time: formattedTime,
      });
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
          Contractor Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Total Contracts Created */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Total Contracts Created</h3>
            <p className="text-4xl font-bold text-center text-blue-500">{contracts.length}</p>
          </div>
        
          {/* Remaining Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Remaining Contracts</h3>
            <p className="text-4xl font-bold text-center text-orange-500">6</p>
          </div>

          {/* Approved Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Approved Contracts</h3>
            <p className="text-4xl font-bold text-center text-green-500">23</p>
          </div>

          {/* Rejected Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">Rejected Contracts</h3>
            <p className="text-4xl font-bold text-center text-red-500">2</p>
          </div>

          {/* Total Income  */}
          <TotIncome contracts={contracts} />
          {/* Total Income LKR  */}
          <TotIncomeLKR contracts={contracts} /> 

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
