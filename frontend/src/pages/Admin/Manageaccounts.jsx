import React, { useState, useEffect } from 'react';
import Navbar from "../../Components/NavBar";
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import { FaEdit, FaTrash, FaSun, FaMoon, FaArrowLeft } from "react-icons/fa";



const Manageaccountsadmin = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("Active");
  const [darkMode, setDarkMode] = useState(true);
  const [selectedHead, setSelectedHead] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

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

  const filteredHeads = departmentHeads.filter(head => {
    const searchLower = searchTerm.toLowerCase();
    return (
      `${head.firstname} ${head.lastname}`.toLowerCase().includes(searchLower) ||
      head.employeeid?.toLowerCase().includes(searchLower)
    );
  }).filter(head => head.status === activeTab);

  // In Manageaccountsadmin.jsx, modify the handleSave function:
const handleSave = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/department-heads/${selectedHead._id}`,
      {
        ...selectedHead,
        activityType: 'account_update', // Add this
        performedBy: localStorage.getItem('userId') // Add admin's user ID
      }
    );
    if (response.status === 200) {
      setDepartmentHeads(prev => 
        prev.map(h => h._id === selectedHead._id ? response.data : h)
      );
      setIsEditing(false);
      setEditMode(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 4000);
    }
  } catch (error) {
    console.error("Error updating department head:", error);
  }
};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/admin/department-heads/${id}`);
      setDepartmentHeads(prev => prev.filter(h => h._id !== id));
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 4000);
    } catch (error) {
      console.error("Error deleting department head:", error);
    }
  };

  const handleEditClick = () => {
    setShowPopup(false);
    setEditMode(true);
    setIsEditing(false); // Start in view mode, need to click Edit button to edit
  };

  const handleBackToView = () => {
    setEditMode(false);
    setShowPopup(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <div className="flex min-h-screen">
        {!isSidebarVisible && <Sidebar />}

        {!editMode ? (
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold font-poppins py-2 px-4 rounded-lg ${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white`}>
                  Manage Accounts
                </h1>
                <div className="flex items-center space-x-4 font-poppins">
                  <input
                    type="text"
                    placeholder="Search department heads"
                    className={`w-72 p-2 border-2 rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-600 text-white"
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-6 border-b mb-6 font-poppins ">
                {["Active", "InActive"].map(status => (
                  <button
                    key={status}
                    className={`px-4 py-2 text-lg ${activeTab === status ? "border-b-4 border-blue-500" : "text-gray-500"}`}
                    onClick={() => setActiveTab(status)}
                  >
                    {status} Members ({departmentHeads.filter(h => h.status === status).length})
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-8">Loading department heads...</div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
              ) : filteredHeads.length === 0 ? (
                <div className="text-center py-8">No department heads found</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredHeads.map(head => (
                    <div 
                      key={head._id}
                      className={`p-6 rounded-xl shadow-lg cursor-pointer transition-transform hover:scale-105 ${
                        darkMode ? "bg-gray-700" : "bg-[#064979] text-white"
                      }`}
                      onClick={() => {
                        setSelectedHead(head);
                        setShowPopup(true);
                      }}
                    >
                      <div className="flex items-center space-x-6 font-poppins ">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center overflow-hidden bg-gray-200">
                          {head.profilePic ? (
                            <img 
                              src={head.profilePic} 
                              alt={`${head.firstname} ${head.lastname}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-gray-600">
                              {head.firstname?.charAt(0)}{head.lastname?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-Semibold ">{head.firstname} {head.lastname} ({head.department})</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            head.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}>
                            {head.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {/* Edit Department Head Form */}
              <div className="space-y-6">
                <div className="flex justify-between items-center w-full">
                  <button
                    onClick={handleBackToView}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <FaArrowLeft className="mr-2" /> Back to View
                  </button>
                  <h2
                    className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block font-poppins ${
                      darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white"
                    } shadow-lg`}
                  >
                    Edit Department Head: {selectedHead?.firstname} {selectedHead?.lastname}
                  </h2>
                  <div className="w-8"></div> {/* Spacer for alignment */}
                </div>

                <form className="space-y-4 font-poppins">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* First Name Field */}
                    <div className="flex flex-col">
                      <label className="font-medium">First Name:</label>
                      <input
                        type="text"
                        name="firstname"
                        value={selectedHead?.firstname}
                        onChange={(e) => setSelectedHead({...selectedHead, firstname: e.target.value})}
                        disabled={!isEditing}
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } ${!isEditing ? "cursor-not-allowed" : ""}`}
                      />
                    </div>

                    {/* Last Name Field */}
                    <div className="flex flex-col">
                      <label className="font-medium">Last Name:</label>
                      <input
                        type="text"
                        name="lastname"
                        value={selectedHead?.lastname}
                        onChange={(e) => setSelectedHead({...selectedHead, lastname: e.target.value})}
                        disabled={!isEditing}
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } ${!isEditing ? "cursor-not-allowed" : ""}`}
                      />
                    </div>

                    {/* Employee ID Field (Read-Only) */}
                    <div className="flex flex-col">
                      <label className="font-medium">Employee ID:</label>
                      <input
                        type="text"
                        name="employeeid"
                        value={selectedHead?.employeeid}
                        readOnly
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } opacity-60 cursor-not-allowed`}
                      />
                    </div>

                    {/* Department Field (Read-Only) */}
                    <div className="flex flex-col">
                      <label className="font-medium">Department:</label>
                      <input
                        type="text"
                        name="department"
                        value={selectedHead?.department}
                        readOnly
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } opacity-60 cursor-not-allowed`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col">
                      <label className="font-medium">Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={selectedHead?.email}
                        onChange={(e) => setSelectedHead({...selectedHead, email: e.target.value})}
                        disabled={!isEditing}
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } ${!isEditing ? "cursor-not-allowed" : ""}`}
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="flex flex-col">
                      <label className="font-medium">Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={selectedHead?.phone}
                        onChange={(e) => setSelectedHead({...selectedHead, phone: e.target.value})}
                        disabled={!isEditing}
                        className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          darkMode
                            ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                            : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                        } ${!isEditing ? "cursor-not-allowed" : ""}`}
                      />
                    </div>

                    {/* Status Toggle */}
                    <div className="flex flex-col">
                      <label className="font-medium">Status:</label>
                      <div className="flex items-center">
                        <span className={`mr-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
                          {selectedHead?.status === "Active" ? "Active" : "InActive"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditing) {
                              const newStatus = selectedHead?.status === "Active" ? "InActive" : "Active";
                              setSelectedHead({...selectedHead, status: newStatus});
                            }
                          }}
                          disabled={!isEditing}
                          className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                            selectedHead?.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span
                            className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                              selectedHead?.status === "Active" ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBackToView}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={isEditing ? handleSave : () => setIsEditing(true)}
                      className="px-6 py-2 bg-[#064979] text-white rounded-lg hover:bg-blue-600"
                    >
                      {isEditing ? "Save Changes" : "Edit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Department Head Details Popup */}
      {showPopup && selectedHead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`p-8 rounded-lg shadow-xl w-96 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Details of {selectedHead.firstname} {selectedHead.lastname}</h2>
              <div className="flex space-x-4">
                <FaEdit 
                  className="text-xl cursor-pointer text-blue-500" 
                  onClick={handleEditClick}
                />
                <FaTrash 
                  className="text-xl cursor-pointer text-red-500" 
                  onClick={() => {
                    if (window.confirm("Delete this department head?")) {
                      handleDelete(selectedHead._id);
                      setShowPopup(false);
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="space-y-4 font-poppins ">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedHead.firstname} {selectedHead.lastname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Department:</span>
                <span>{selectedHead.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Employee ID:</span>
                <span>{selectedHead.employeeid}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{selectedHead.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{selectedHead.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedHead.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}>
                  {selectedHead.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Messages */}
      {deleteSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-poppins ">
            <div className={`px-6 py-4 rounded-lg shadow-lg text-2xl font-bold font-poppins  ${
            darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
            }`}  >
            Department head deleted successfully!
          </div>
        </div>
      )}

          {updateSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-poppins ">
          <div className={`px-6 py-4 rounded-lg shadow-lg text-2xl font-bold font-poppins ${
            darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
            }`}  >
            Department head updated successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default Manageaccountsadmin;