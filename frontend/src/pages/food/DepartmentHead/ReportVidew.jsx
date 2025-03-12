// src/components/food/departmenthead.jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar'

const Reportviewfoodhead = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

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