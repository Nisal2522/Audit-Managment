import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/NavBar";
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import { FaSun, FaMoon, FaArrowLeft, FaSearch } from "react-icons/fa";

const Resetpasswordadmin = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedHead, setSelectedHead] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/department-heads`);
        if (Array.isArray(response.data)) {
          setDepartmentHeads(response.data);
        } else {
          setError("Invalid data format received from server");
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter heads by exact employee ID match
  const filteredHeads = searchTerm ? 
    departmentHeads.filter(head => 
      head.employeeid?.toLowerCase() === searchTerm.toLowerCase()
    ) : [];

  const handleResetPassword = async () => {
    if (!selectedHead) return;
    
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      setEmailStatus(null);
      const response = await axios.post(
        `${API_URL}/api/admin/reset-password`,
        {
          userId: selectedHead._id,
          newPassword: newPassword,
          activityType: 'password_reset',
          performedBy: localStorage.getItem('userId')
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setResetSuccess(true);
        setSearchTerm('');
        setNewPassword('');
        setConfirmPassword('');
        setEmailStatus('success');
        setTimeout(() => {
          setResetSuccess(false);
          setEmailStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMsg = error.response?.data?.message || "Failed to reset password";
      
      if (errorMsg.includes('email')) {
        setEmailStatus('warning');
        alert("Password was reset but notification email failed to send. Please notify the user manually.");
      } else {
        alert(errorMsg);
      }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <div className="flex min-h-screen">
        {!isSidebarVisible && <Sidebar />}

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className={`text-2xl font-bold font-poppins py-2 px-4 rounded-lg ${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white`}>
                Reset Password
              </h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-600 text-white"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>

            <div className="mb-8 font-poppins">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter Employee ID"
                  className={`w-full pl-10 p-2 border-2 rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedHead(null);
                  }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 font-poppins">Loading employee data...</div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
            ) : searchTerm && filteredHeads.length === 0 ? (
              <div className="text-center py-8">No employee found with ID: {searchTerm}</div>
            ) : (
              <div className="space-y-6 font-poppins">
                {/* Display matching employee */}
                {filteredHeads.length > 0 && (
                  <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-700" : "bg-[#064979] text-white"}`}>
                    <div className="flex items-center space-x-6 font-poppins">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
                        {filteredHeads[0].profilePic ? (
                          <img 
                            src={filteredHeads[0].profilePic} 
                            alt={`${filteredHeads[0].firstname} ${filteredHeads[0].lastname}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600">
                            {filteredHeads[0].firstname?.charAt(0)}{filteredHeads[0].lastname?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{filteredHeads[0].firstname} {filteredHeads[0].lastname}</h3>
                        <p className="text-sm">Department: {filteredHeads[0].department}</p>
                        <p className="text-sm">Employee ID: {filteredHeads[0].employeeid}</p>
                        <p className="text-sm">Email: {filteredHeads[0].email}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          filteredHeads[0].status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}>
                          {filteredHeads[0].status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password reset form */}
                {filteredHeads.length > 0 && (
                  <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h2 className="text-xl font-semibold mb-4">Reset Password for {filteredHeads[0].firstname} {filteredHeads[0].lastname}</h2>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label className="font-medium">New Password:</label>
                        <input
                          type="password"
                          placeholder="Enter new password (min 8 characters)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
                              : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="font-medium">Confirm New Password:</label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
                              : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>

                      <button
                        onClick={() => {
                          setSelectedHead(filteredHeads[0]);
                          handleResetPassword();
                        }}
                        className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-4 transition duration-300"
                      >
                        Reset Password
                      </button>

                      {emailStatus === 'warning' && (
                        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
                          Password was reset but the notification email failed to send. Please notify the user manually.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {resetSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-poppins">
          <div className={`px-6 py-4 rounded-lg shadow-lg text-center ${
            darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
          }`}>
            <div className="text-2xl font-bold mb-2 font-poppins ">Password reset successfully!</div>
            {emailStatus === 'success' && (
              <div className="text-[#064979 ] font-medium font-poppins">
                Notification email has been sent to the user.
              </div>
            )}
            <button
              onClick={() => setResetSuccess(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resetpasswordadmin;