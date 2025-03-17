// src/components/food/departmenthead.jsx
import React from 'react';
import Navbar from '../../../Components/NavBar';
import Sidebar from './Sidebar'

const Activeaccountfood = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Navbar />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        <main className="flex-grow p-8 bg-white rounded-lg shadow-md">
          <label className="text-xl font-semibold text-black bg-slt-sltGreenPrimary py-2 px-4 rounded-lg inline-block mb-6">
            Active Accountss
          </label>




        </main>
        </div>  
        </div>
    
  );
};

export default Activeaccountfood;