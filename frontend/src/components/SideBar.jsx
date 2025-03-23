import { Menu } from 'lucide-react'; // Menu icon
import { 
  FiGrid,        // Dashboard
  FiClipboard,   // Can be used for Contract creation, reports, etc.
  FiUser,        // Profile
  FiLogOut,      // Logout
  FiFileText,    // Contract Status
  FiDollarSign,  // Income Status
  FiUploadCloud, // Uploads & Sent Docs
  FiBarChart2,   // Reports
  FiBell,        // Announcements
  FiPieChart     // Summary
} from 'react-icons/fi';

import React, { useState } from "react";

const SideBar = ({ toggleSidebar }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-[#064979] text-white p-4 transform transition-transform duration-200 ease-in-out">
      <button onClick={toggleSidebar} className="text-white hover:text-gray-400 mb-4 mt-2">
        <Menu size={24} />
      </button>
      <ul className="">

        <li className="mb-4">
          <a href="/" className="flex items-center p-2 hover:bg-gray-700 rounded mt-10">
            <FiGrid className="mr-2" /> Dashboard
          </a>
        </li>

        <li className="mb-4">
          <a href="/ContractCreation" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiClipboard className="mr-2" /> Contract Creation
          </a>
        </li>

        <li className="mb-4">
          <a href="ContractStatus" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiFileText className="mr-2" /> Contract Status
          </a>
        </li>

        <li className="mb-4">
          <a href="IncomeStatus" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiDollarSign className="mr-2" /> Income Status
          </a>
        </li>

        <li className="mb-4">
          <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiUploadCloud className="mr-2" /> Uploads & Sent Docs
          </a>
        </li>

        <li className="mb-4">
          <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiBarChart2 className="mr-2" /> Reports
          </a>
        </li>

        <li className="mb-4">
          <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiBell className="mr-2" /> Announcements
          </a>
        </li>

        <li className="mb-4">
          <a href="#" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiPieChart className="mr-2" /> Summary
          </a>
        </li>

        <li className="mb-4">
          <a href="/profile" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <FiUser className="mr-2" /> Profile
          </a>
        </li>

        <li className="mb-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center p-2 hover:bg-gray-700 rounded w-full text-left"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-[#045a94] rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-bold text-gray-800">Confirm Logout</h2>
            <p className="text-white-600 mt-2">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-black rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SideBar;
