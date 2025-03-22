// src/components/food/departmenthead.jsx
import React from 'react';
import Sidebar from './Sidebar'
import Navbar from '../../../Components/NavBar';
import  { useState  } from "react";

const Reportviewfoodhead = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      <div className="flex flex-grow">
        {/* Sidebar */}
        {!isSidebarVisible && <Sidebar />}

        <main className="flex-grow p-8 bg-white rounded-lg shadow-md">
          <label className="text-xl font-semibold text-black bg-slt-sltGreenPrimary py-2 px-4 rounded-lg inline-block mb-6">
            ReportView
          </label>




        </main>
        </div>  
        </div>
    
  );
};

export default Reportviewfoodhead;