// src/components/food/departmenthead.jsx
import React, { useState } from 'react';
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/Sidebar";
import { FaSun, FaMoon } from "react-icons/fa";

const Reportviewfoodhead = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} flex flex-col`}>
      {/* Header */}
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      <div className="flex flex-grow">
        {/* Sidebar */}
        {!isSidebarVisible && <Sidebar />}

        <main className="flex-grow p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <label className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'} bg-slt-sltGreenPrimary py-2 px-4 rounded-lg inline-block`}>
              ReportView
            </label>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Add your content here */}
        </main>
      </div>
    </div>
  );
};

export default Reportviewfoodhead;