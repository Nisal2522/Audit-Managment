import React, { useState, useEffect } from "react";
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/Sidebar";
import { FaSun, FaMoon, FaTrash, FaCheck, FaTimes, FaEye, FaUserCircle } from "react-icons/fa";
import axios from "axios";

const RequestLeaveFood = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [processedRequests, setProcessedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Set base URL for API requests
  const API_BASE_URL = "http://localhost:5005/api/leave-requests";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
    document.body.style.fontFamily = "'Poppins', sans-serif";
  }, [darkMode]);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get(API_BASE_URL);
        if (response.data && Array.isArray(response.data)) {
          const pending = response.data.filter(request => request.status === 'pending');
          const processed = response.data.filter(request => request.status !== 'pending');
          setPendingRequests(pending);
          setProcessedRequests(processed);
        } else {
          setPendingRequests([]);
          setProcessedRequests([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to fetch leave requests");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPendingRequests(pendingRequests.filter(request => request._id !== id));
      setProcessedRequests(processedRequests.filter(request => request._id !== id));
      setSuccess('Leave request deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error("Delete Error:", err);
      setError("Failed to delete leave request");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status });
      
      // Find the request in pendingRequests
      const updatedRequest = pendingRequests.find(request => request._id === id);
      
      if (updatedRequest) {
        // Remove from pending and add to processed
        setPendingRequests(pendingRequests.filter(request => request._id !== id));
        setProcessedRequests([...processedRequests, { ...updatedRequest, status }]);
        
        setSuccess(`Leave request ${status} successfully`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error("Status Update Error:", err);
      setError("Failed to update leave request status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
        <div className="flex flex-grow justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#064979]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');`}
      </style>
      
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      <div className="flex flex-grow">
        {!isSidebarVisible && <Sidebar />}
        <main className="flex-grow p-4 md:p-8 transition-all duration-300">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <label
                className="text-2xl font-bold py-2 px-4 rounded-lg inline-block shadow-lg font-poppins text-white bg-[#064979]"
              >
                Leave Requests Management
              </label>
              <p className={`font-medium mt-2 ml-2 ${darkMode ? 'text-white' : 'text-black'}`}>
                {pendingRequests.length} pending {pendingRequests.length === 1 ? 'request' : 'requests'}
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out -mt-12"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-100 rounded-lg shadow-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-100 rounded-lg shadow-sm">
              <p className="font-medium">{success}</p>
            </div>
          )}

          {/* Pending Leave Requests Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-4 bg-[#064979] text-white">
              <h2 className="text-lg font-semibold">Pending Requests</h2>
            </div>
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <FaUserCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No pending requests</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">All requests have been processed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 font-poppins">
                  <thead className="bg-gray-500 dark:bg-black font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Leave Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#064979] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                              {request.employeeId.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{request.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            px-3 py-1 inline-flex items-center text-xs font-bold rounded-full 
                            uppercase tracking-wider shadow-md
                            ${
                              request.leaveCategory === 'vacation' 
                                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' 
                                : request.leaveCategory === 'sick' 
                                ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' 
                                : 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'
                            }`
                          }>
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-white/80"></span>
                            {request.leaveCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(request.startDate)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">to {formatDate(request.endDate)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">{request.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.documentUrl ? (
                            <a 
                              href={request.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#064979] dark:text-blue-400 hover:underline flex items-center font-medium"
                            >
                              <FaEye className="mr-2" />
                              <span>View</span>
                            </a>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'approved')}
                              className="flex items-center justify-center px-3 py-1 rounded-lg bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 transition-colors shadow-sm"
                              title="Approve"
                            >
                              <FaCheck className="mr-1" />
                              <span className="text-xs font-medium">Approve</span>
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'rejected')}
                              className="flex items-center justify-center px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                              title="Reject"
                            >
                              <FaTimes className="mr-1" />
                              <span className="text-xs font-medium">Reject</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Processed Leave Requests Table */}
          {processedRequests.length > 0 && (
            <div className="bg-[#064979] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-[#064979] dark:bg-gray-700">
                <h2 className="text-lg font-semibold text-white">Processed Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 font-poppins">
                  <thead className="bg-gray-500 dark:bg-black font-semibold">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Leave Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Document</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {processedRequests.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-[#064979] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                              {request.employeeId.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{request.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            px-3 py-1 inline-flex items-center text-xs font-bold rounded-full 
                            uppercase tracking-wider shadow-md
                            ${
                              request.leaveCategory === 'vacation' 
                                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' 
                                : request.leaveCategory === 'sick' 
                                ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' 
                                : 'bg-gradient-to-r from-indigo-400 to-indigo-600 text-white'
                            }`
                          }>
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-white/80"></span>
                            {request.leaveCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(request.startDate)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">to {formatDate(request.endDate)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">{request.reason}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {request.documentUrl ? (
                            <a 
                              href={request.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#064979] dark:text-blue-400 hover:underline flex items-center font-medium"
                            >
                              <FaEye className="mr-2" />
                              <span>View</span>
                            </a>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(request._id)}
                            className="flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm"
                            title="Delete"
                          >
                            <FaTrash className="mr-1" />
                            <span className="text-xs font-medium">Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RequestLeaveFood;