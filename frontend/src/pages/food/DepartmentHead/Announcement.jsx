import React, { useState, useEffect } from 'react';
import Navbar from "../../../components/NavBar";
import Sidebar from '../../../components/Sidebar';
import axios from 'axios';
import { FaTrash, FaChevronLeft, FaChevronRight ,FaMoon ,FaSun} from "react-icons/fa";

const AnnouncementsFoodHead = () => {
  const [announcement, setAnnouncement] = useState('');
  const [announcementsubject, setannouncementsubject] = useState('');
  const [position, setPosition] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeDepartment, SetemployeeDepartment] = useState('');
  const [audienceType, setAudienceType] = useState('individual');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [previousAnnouncements, setPreviousAnnouncements] = useState([]);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const announcementsPerPage = 3;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
    }

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5005/api/employees', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
        alert('Failed to fetch employees. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5005/api/announcements', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPreviousAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchEmployees();
    fetchAnnouncements();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = previousAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(previousAnnouncements.length / announcementsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAnnouncementChange = (event) => {
    setAnnouncement(event.target.value);
  };

  const handleAnnouncementSubmitChange = (event) => {
    setannouncementsubject(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleEmployeeIdChange = (e) => {
    const id = e.target.value;
    setEmployeeId(id);
    
    if (id.length > 0) {
      const matchedEmployees = employees.filter(emp => 
        emp.employeeId.toString().includes(id) ||
        emp.name.toLowerCase().includes(id.toLowerCase())
      );
      setSuggestions(matchedEmployees);
      setShowSuggestions(true);
      
      const exactMatch = employees.find(emp => 
        emp.employeeId.toString() === id ||
        emp.name.toLowerCase() === id.toLowerCase()
      );
      if (exactMatch) {
        setEmployeeName(exactMatch.name);
        setPosition(exactMatch.position);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setEmployeeName('');
    }
  };

  const selectEmployee = (emp) => {
    if (audienceType === 'multipleemployees') {
      if (!selectedEmployees.some(e => e.employeeId === emp.employeeId)) {
        setSelectedEmployees([...selectedEmployees, {
          employeeId: emp.employeeId,
          name: emp.name,
          position: emp.role,
          department: emp.department,
        }]);
      }
      setEmployeeId('');
    } else {
      setEmployeeId(emp.employeeId);
      setEmployeeName(emp.name);
      setPosition(emp.role);
      SetemployeeDepartment(emp.department);
    }
    setShowSuggestions(false);
  };

  const removeSelectedEmployee = (id) => {
    setSelectedEmployees(selectedEmployees.filter(emp => emp.employeeId !== id));
  };

  const handleAudienceTypeChange = (event) => {
    setAudienceType(event.target.value);
    setPosition('');
    setEmployeeId('');
    setEmployeeName('');
    SetemployeeDepartment('');
    setSelectedEmployees([]);
    setShowSuggestions(false);
  };

  const handleSubmitAnnouncement = async () => {
    if (!userData) {
      alert("Please log in first");
      return;
    }
    
    if (!announcement.trim()) {
      alert("Please enter a valid announcement.");
      return;
    }

    if (!announcementsubject.trim()) {
      alert("Please enter a subject for an Announcement.");
      return;
    }
    
    if (audienceType === 'position' && !position) {
      alert("Please select a position.");
      return;
    }
    
    if (audienceType === 'individual' && (!employeeId || !employeeName)) {
      alert("Please select an employee.");
      return;
    }
  
    if (audienceType === 'multipleemployees' && selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
  
    try {
      let sentTo = {};
    
      if (audienceType === 'position') {
        sentTo = {
          type: 'Team Announcement',
          position: position,
          department: userData.department
        };
      } else if (audienceType === 'individual') {
        sentTo = {
          type: 'Individual Announcement',
          employee_details: [{
            employeeId: employeeId,
            name: employeeName,
            position: position,
            department: employeeDepartment,
          }]
        };
      } else if (audienceType === 'multipleemployees') {
        sentTo = {
          type: 'multipleemployees Announcement',
          employee_details: selectedEmployees.map(emp => ({
            employeeId: emp.employeeId,
            name: emp.name,
            position: emp.position,
            department: emp.department,
          }))
        };
      }
  
      const newAnnouncement = {
        title: `Announcement from ${userData.position}`,
        message: announcement,
        subject: announcementsubject,
        sentTo: sentTo,
        date: new Date().toISOString(),
        sender: {
          email: userData.email,
          employeeId: userData.employeeId,
          position: userData.position,
          department: userData.department
        }
      };
  
      await axios.post('http://localhost:5005/api/announcements/create', newAnnouncement, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      setAnnouncement('');
      setannouncementsubject('');
      setEmployeeId('');
      setEmployeeName('');
      setPosition('');
      setSelectedEmployees([]);
      
      // Refresh announcements list
      const response = await axios.get('http://localhost:5005/api/announcements', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPreviousAnnouncements(response.data);
      setCurrentPage(1); // Reset to first page after new announcement

      setSuccessMessage('Announcement sent successfully!');
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);

    } catch (err) {
      console.error('Error saving announcement:', err);
      alert('Failed to send announcement. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5005/api/announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      // Set the success message to show a pop-up on the screen
      setDeleteSuccessMessage("Announcement deleted successfully!");
  
      // Optionally, clear the message after 3 seconds
      setTimeout(() => {
        setDeleteSuccessMessage('');
      }, 4000); // Message disappears after 3 seconds
  
      // Remove the deleted announcement from the state
      setPreviousAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
      
      // Adjust current page if we deleted the last item on the page
      if (currentAnnouncements.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete the announcement");
    }
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100'}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="flex flex-grow">
        {!isSidebarVisible && <Sidebar darkMode={darkMode} />}
        <main className="flex-grow p-6">
          
          <div className="max-w-6xl mx-auto">
          <button 
                onClick={toggleDarkMode}
                className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out ml-[1130px] "
                >
                {darkMode ? (
                  <FaSun className="w-5 h-5 text-white" />
                ) : (
                  <FaMoon className="w-5 h-5 text-white" />
                )}
              </button>
         
            {/* Header Card */}
            <div className={`${darkMode ? 'bg-[#064979]' : 'bg-[#064979]'} text-white rounded-lg shadow-lg p-4 mb-8 w-[1100px] -mt-8`}>
              
              <h1 className="text-2xl font-bold font-poppins">Announcements</h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-blue-100'} font-poppins`}>Manage and create announcements for your team</p>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
              <button
                className={`py-2 px-4 font-medium font-poppins ${activeTab === 'create' ? 
                  `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-[#064979] border-b-2 border-[#064979]'}` : 
                  `${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-[#064979]'}`}`}
                onClick={() => setActiveTab('create')}
              >
                Create Announcement
              </button>
              <button
                className={`py-2 px-4 font-medium font-poppins ${activeTab === 'previous' ? 
                  `${darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-[#064979] border-b-2 border-[#064979]'}` : 
                  `${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-[#064979]'}`}`}
                onClick={() => setActiveTab('previous')}
              >
                Previous Announcements
              </button>
            </div>

            {activeTab === 'create' ? (
              <>
                {/* Audience Selection Card */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
                  <div className={`${darkMode ? 'bg-[#064979]' : 'bg-[#064979]'} text-white rounded-lg shadow-lg p-4 mb-6`}>
                    <h2 className="text-lg font-semibold text-white border-b pb-2 mb-2 font-poppins">Audience Selection</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 font-poppins">
                    <label className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} min-w-[150px] font-poppins`}>Audience Type: </label>
                    <select 
                      value={audienceType} 
                      onChange={handleAudienceTypeChange} 
                      className={`flex-grow p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                    >
                      <option value="individual">Specific Employee</option>
                      <option value="multipleemployees">Multiple Employees</option>
                      <option value="position">Team</option>
                    </select>
                  </div>

                  {audienceType === 'position' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <label className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} min-w-[150px] font-poppins`}>Select Position: </label>
                      <select 
                        value={position} 
                        onChange={handlePositionChange} 
                        className={`flex-grow p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                      >
                        <option value="">Select a position</option>
                        <option value="Project Creator">Project Creators</option>
                        <option value="Planner">Planners</option>
                        <option value="Contractor">Contractors</option>
                        <option value="Auditor">Auditors</option>
                        <option value="Certifier">Certifiers</option>
                        <option value="Reviewer">Reviewers</option>
                      </select>
                    </div>
                  )}

                  {audienceType === 'individual' && (
                    <div className="relative">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                        <label className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} min-w-[150px] font-poppins`}>Select Employee: </label>
                        <div className="flex-grow relative">
                          <input
                            type="text"
                            value={employeeId}
                            onChange={handleEmployeeIdChange}
                            onFocus={() => employeeId && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                            placeholder="Search by ID or name"
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <div className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'} max-h-60 overflow-y-auto`}>
                              {suggestions.map(emp => (
                                <div 
                                  key={emp._id}
                                  className={`p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-[#064979]/10'} cursor-pointer border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                                  onClick={() => selectEmployee(emp)}
                                >
                                  <div className={`font-medium ${darkMode ? 'text-white' : ''}`}>{emp.employeeId} - {emp.name}</div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{emp.position}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {employeeName && (
                        <div className={`mt-3 p-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-[#064979]/10 border-[#064979]/30'} rounded-lg border font-poppins`}>
                          <div className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-[#064979]'} font-poppins`}>Selected Employee:</div>
                          <div className={darkMode ? 'text-gray-300' : ''}>{employeeName} (ID: {employeeId}, {position})</div>
                        </div>
                      )}
                    </div>
                  )}

                  {audienceType === 'multipleemployees' && (
                    <div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2 font-poppins">
                        <label className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} min-w-[150px] font-poppins`}>Add Employees: </label>
                        <div className="flex-grow relative font-poppins">
                          <input
                            type="text"
                            value={employeeId}
                            onChange={handleEmployeeIdChange}
                            onFocus={() => employeeId && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className={`w-full p-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                            placeholder="Search by ID or name"
                          />
                          {showSuggestions && suggestions.length > 0 && (
                            <div className={`absolute z-10 mt-1 w-full ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'} max-h-60 overflow-y-auto`}>
                              {suggestions.map(emp => (
                                <div 
                                  key={emp._id}
                                  className={`p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-[#064979]/10'} cursor-pointer border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
                                  onClick={() => selectEmployee(emp)}
                                >
                                  <div className={`font-medium ${darkMode ? 'text-white' : ''}`}>{emp.employeeId} - {emp.name}</div>
                                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{emp.position}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedEmployees.length > 0 && (
                        <div className="mt-4">
                          <h4 className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-[#064979]'} mb-2 font-poppins`}>Selected Employees:</h4>
                          <div className={`max-h-40 overflow-y-auto border rounded-lg p-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50'}`}>
                            {selectedEmployees.map(emp => (
                              <div key={emp.employeeId} className={`flex justify-between items-center p-2 border-b ${darkMode ? 'hover:bg-gray-600 border-gray-600' : 'hover:bg-gray-100'}`}>
                                <div>
                                  <span className={`font-medium ${darkMode ? 'text-white' : ''}`}>{emp.name}</span> 
                                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} ml-2 font-poppins`}>(ID: {emp.employeeId}, {emp.position})</span>
                                </div>
                                <button 
                                  onClick={() => removeSelectedEmployee(emp.employeeId)}
                                  className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} p-1`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Announcement Form Card */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <div className={`${darkMode ? 'bg-[#064979]' : 'bg-[#064979]'} text-white rounded-lg shadow-lg p-4 mb-6`}>
                    <h2 className="text-lg font-semibold text-white border-b pb-2 mb-2 font-poppins">Announcement Details</h2>
                  </div>
                  <div className="mb-4 font-poppins">
                    <label className={`block font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 font-poppins`}>Subject:</label>
                    <input
                      value={announcementsubject}
                      onChange={handleAnnouncementSubmitChange}
                      className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                      placeholder="Announcement subject..."
                    />
                  </div>
                  
                  <div className="mb-6 font-poppins">
                    <label className={`block font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 font-poppins`}>Message:</label>
                    <textarea
                      value={announcement}
                      onChange={handleAnnouncementChange}
                      rows="6"
                      className={`w-full p-3 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-blue-500' : 'focus:ring-[#064979]'} focus:border-transparent shadow-sm`}
                      placeholder="Write your announcement here..."
                    />
                  </div>
                  
                  <div className="flex justify-end font-poppins">
                    <button
                      onClick={handleSubmitAnnouncement}
                      disabled={isLoading}
                      className={`py-2 px-6 rounded-lg shadow-md transition-all duration-200 font-medium
                        ${isLoading 
                          ? `${darkMode ? 'bg-gray-600' : 'bg-gray-400'} cursor-not-allowed` 
                          : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#064979] hover:bg-[#04355a]'} text-white hover:shadow-lg`}
                      `}
                    >
                      {isLoading ? (
                        <span className="flex items-center font-poppins">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : 'Send Announcement'}
                    </button>
                  </div>
                  {successMessage && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-[#064979]'} text-xl font-semibold font-poppins px-5 py-2 rounded-md shadow-md transition-opacity duration-300`}> 
                      {successMessage}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className={`${darkMode ? 'bg-[#064979]' : 'bg-[#064979]'} text-white rounded-lg shadow-lg p-4 mb-6`}>
                  <h2 className="text-lg font-semibold text-white border-b pb-2 mb-2 font-poppins">Previous Announcements</h2>
                </div>
                
                {previousAnnouncements.length === 0 ? (
                  <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>
                    No announcements found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentAnnouncements.map((announcement) => (
                      <div key={announcement._id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${darkMode ? 'border-gray-700 bg-gray-700 hover:shadow-gray-600' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-semibold text-lg ${darkMode ? 'text-blue-400' : 'text-[#064979]'} font-poppins`}>{announcement.subject}</h3>
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-poppins`}>{formatDate(announcement.date)}</span>
                        </div>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 font-poppins`}>{announcement.message}</p>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} font-poppins`}>
                          <span className="font-semibold">Sent to:</span> {announcement.sentTo.type === 'Team Announcement' 
                            ? `${announcement.sentTo.position} in ${announcement.sentTo.department}`
                            : announcement.sentTo.employee_details.map(e => `${e.name} (${e.employeeId})`).join(', ')}
                        </div>
                        <div className={`flex justify-between items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 font-poppins`}>
                          <div>
                            <span className="font-semibold">From:</span> {announcement.sender.position} ({announcement.sender.department})
                          </div>
                          <FaTrash 
                            className={`${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-black hover:text-red-700'} cursor-pointer`} 
                            onClick={() => handleDelete(announcement._id)} 
                          />
                        </div>
                      </div>
                    ))}

                    {/* Pagination Controls */}
                    {previousAnnouncements.length > announcementsPerPage && (
                      <div className="flex justify-center items-center mt-6">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 mx-1 rounded ${currentPage === 1 ? 
                            `${darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}` : 
                            `${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-[#064979] hover:bg-[#064979]/10'}`}`}
                        >
                          <FaChevronLeft />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`p-2 mx-1 w-10 h-10 rounded-full ${currentPage === number ? 
                              `${darkMode ? 'bg-blue-600 text-white' : 'bg-[#064979] text-white'}` : 
                              `${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-[#064979] hover:bg-[#064979]/10'}`}`}
                          >
                            {number}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 mx-1 rounded ${currentPage === totalPages ? 
                            `${darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'}` : 
                            `${darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-[#064979] hover:bg-[#064979]/10'}`}`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {deleteSuccessMessage && (
                  <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${darkMode ? 'bg-gray-800 text-blue-400' : 'bg-white text-[#064979]'} text-xl font-semibold font-poppins px-5 py-2 rounded-md shadow-md transition-opacity duration-300`}>
                    {deleteSuccessMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsFoodHead;