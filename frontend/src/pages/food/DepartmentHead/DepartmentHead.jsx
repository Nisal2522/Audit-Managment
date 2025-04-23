import React, { useState, useEffect, useRef } from "react";
import { FiShare2, FiMoreHorizontal } from "react-icons/fi";
import { FaSun, FaMoon, FaSearch, FaPaperclip, FaMicrophone, FaEllipsisV } from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/NavBar";
import { getEmployees } from "../../../services/employeeservice";
import axios from "axios";

const DepartmentheadFood = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const messageInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const [departmentHeads, setDepartmentHeads] = useState([]);
  
  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const firstname = userData.firstname || 'User';
  const status = userData.status || 'Active';
  const department = userData.department || 'Food';
  const employeeId = userData.employeeid || '';

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeData = await getEmployees();
        const departmentEmployees = employeeData.filter(emp => 
          emp.department?.toLowerCase() === department.toLowerCase()
        );
        setEmployees(departmentEmployees);
        await fetchDepartmentHeads();
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [department]);

  useEffect(() => {
    if (activeTab === 'chat' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.employeeId);
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 0);
    }
  }, [selectedChat]);

  const fetchUnreadCounts = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const currentEmployeeId = currentUser.employeeid;
      
      const response = await axios.get(`${API_URL}/api/admin/unread-counts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
          receiverEmployeeId: currentEmployeeId
        }
      });
      
      setUnreadCounts(response.data.unreadCounts || {});
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const markMessagesAsRead = async (messageIds, chatId) => {
    try {
      const response = await axios.put(`${API_URL}/api/admin/update-message-status`, {
        messageIds,
        chatId
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Update local state to reflect read status
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          messageIds.includes(msg._id) ? {...msg, read: true} : msg
        )
      );
      
      // Update unread counts
      if (response.data.unreadCount !== undefined) {
        setUnreadCounts(prev => ({
          ...prev,
          [chatId]: response.data.unreadCount
        }));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchMessages = async (employeeId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const currentEmployeeId = currentUser.employeeid;
  
      const response = await axios.get(`${API_URL}/api/admin/messages/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const processedMessages = response.data.data
        .filter(msg => {
          return msg.senderEmployeeId === currentEmployeeId || 
                 msg.receiverEmployeeId === currentEmployeeId;
        })
        .map(msg => {
          const isSentByCurrentUser = msg.senderEmployeeId === currentEmployeeId;
          
          return {
            ...msg,
            isCurrentUser: isSentByCurrentUser,
            position: isSentByCurrentUser ? 'right' : 'left',
            senderName: isSentByCurrentUser ? 'You' : ''
          };
        }) || [];
      
      setMessages(processedMessages);
  
      // Mark received messages as read
      const unreadMessages = processedMessages
        .filter(msg => 
          msg.receiverEmployeeId === currentEmployeeId && 
          !msg.read
        );
      
      if (unreadMessages.length > 0) {
        const unreadMessageIds = unreadMessages.map(msg => msg._id);
        await markMessagesAsRead(unreadMessageIds, employeeId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessageHandler = async () => {
    if (!message.trim() || !selectedChat) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const senderEmployeeId = userData.employeeid || '';
      const senderPosition = userData.position || '';
  
      await axios.post(`${API_URL}/api/admin/send-message`, {
        employeeId: selectedChat.employeeId,
        message: message.trim(),
        senderEmployeeId: senderEmployeeId,
        sender: senderPosition.toLowerCase().includes('admin') ? 'admin' : 'department_head'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      await fetchMessages(selectedChat.employeeId);
      setMessage('');
      setTimeout(() => {
        if (messageInputRef.current) {
          messageInputRef.current.focus();
        }
      }, 0);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleChatSelection = async (head) => {
    setMessages([]);
    const newSelectedChat = {
      _id: head._id || head.id,
      name: `${head.firstname || ''} ${head.lastname || ''}`.trim(),
      employeeId: head.employeeid,
      profilePic: head.profilePic,
      lastMessage: "Start chatting",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSelectedChat(newSelectedChat);
    
    // Fetch unread counts whenever we select a new chat
    await fetchUnreadCounts();
  };

  const fetchDepartmentHeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/department-headswithadmin`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const filteredHeads = response.data.filter(head => head.employeeid !== employeeId);
      setDepartmentHeads(filteredHeads);
      
      // Fetch unread counts when we first load the department heads
      await fetchUnreadCounts();
    } catch (error) {
      console.error('Error fetching department heads:', error);
    }
  };

  const filteredHeads = departmentHeads.filter(head => {
    const fullName = `${head.firstname || ''} ${head.lastname || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          bg: 'bg-green-100 dark:bg-green-900',
          text: 'text-green-800 dark:text-green-200',
          dot: 'bg-green-500'
        };
      case 'inactive':
        return {
          bg: 'bg-red-100 dark:bg-red-900',
          text: 'text-red-800 dark:text-red-200',
          dot: 'bg-red-500'
        };
      case 'suspended':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900',
          text: 'text-yellow-800 dark:text-yellow-200',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900',
          text: 'text-blue-800 dark:text-blue-200',
          dot: 'bg-blue-500'
        };
    }
  };

  const statusStyles = getStatusStyles();

  const renderEmployeeCount = () => {
    if (loading) return null;
    if (employees.length === 0) return null;

    const firstEmployee = employees[0] || {};
    const firstName = firstEmployee.name || 'Unknown';
    const othersCount = Math.max(0, employees.length - 1);

    return (
      <div className="flex items-center">
        <h1 className="text-sm font-semibold text-white font-poppins">
          {firstName}
          {othersCount > 0 && (
            <span className="font-normal text-white dark:text-gray-400 font-poppins">
              {" "}+ {othersCount} others
            </span>
          )}
        </h1>
      </div>
    );
  };

  useEffect(() => {
    messageInputRef.current?.focus();
  }, [message]);

  const ChatLayout = () => {
    return (
      <div className={`flex h-full font-poppins ${darkMode ? "bg-gray-900" : "bg-gray-100"}`} style={{ height: 'calc(100vh - 200px)' }}>
        <div className={`w-1/3 border-r ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
          <div 
            className={`p-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} cursor-text`}
            onClick={() => searchInputRef.current?.focus()}
          >
            <div className={`flex items-center rounded-lg px-3 py-2 ${darkMode ? "bg-gray-600" : "bg-white"}`}>
              <FaSearch className={`mr-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search or start new chat"
                className={`flex-1 outline-none ${darkMode ? "bg-gray-600 text-white placeholder-gray-400" : "bg-white text-gray-800"}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
            {filteredHeads.length > 0 ? (
              filteredHeads.map((head) => {
                const unreadCount = unreadCounts[head.employeeid] || 0;
                return (
                  <div
                    key={head._id || head.id}
                    className={`flex items-center p-3 border-b cursor-pointer hover:bg-opacity-50 ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}`}
                    onClick={() => handleChatSelection(head)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                      {head.profilePic ? (
                        <img src={head.profilePic} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-lg">
                          {(head.firstname?.charAt(0) || '').toUpperCase()}
                          {(head.lastname?.charAt(0) || '').toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {head.firstname || ''} {head.lastname || ''}
                        </h3>
                        <div className="flex items-center">
                          {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Department: {head.department || 'N/A'}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`p-4 text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No other department heads available
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
          {selectedChat ? (
            <>
              <div className={`flex items-center justify-between p-3 border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}>
                    {selectedChat.profilePic ? (
                      <img 
                        src={selectedChat.profilePic} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">
                        {selectedChat.name.split(' ').map(n => n.charAt(0)).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{selectedChat.name}</h3>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Online</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
                    <FaSearch />
                  </button>
                  <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
                    <FaEllipsisV />
                  </button>
                </div>
              </div>

              <div className={`flex-1 p-4 overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div 
                      key={`${selectedChat.employeeId}-${index}`} 
                      className={`mb-4 flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.isCurrentUser ? 
                          (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') : 
                          (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')}`}
                      >
                        {!msg.isCurrentUser && (
                          <p className="font-semibold text-xs mb-1">
                            {msg.senderName}
                          </p>
                        )}
                        <p>{msg.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className={`text-xs ${msg.isCurrentUser ? 'text-blue-200' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {msg.isCurrentUser && (
                            <span className={`text-xs ml-2 ${msg.read ? 'text-blue-300' : 'text-gray-400'}`}>
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center p-4 rounded-lg ${darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"}`}>
                    <p>Start of your conversation with {selectedChat.name}</p>
                  </div>
                )}
              </div>

              <div className={`p-3 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center">
                  <button className={`p-2 rounded-full mx-1 ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}>
                    <FaPaperclip />
                  </button>
                  <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type a message"
                    className={`flex-1 py-2 px-4 rounded-full mx-1 outline-none ${darkMode ? "bg-gray-700 text-white placeholder-gray-400" : "bg-gray-100 text-gray-800"}`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMessageHandler();
                    }}
                  />

                  <button 
                    className={`p-2 rounded-full mx-1 ${darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-200 text-gray-600"}`}
                    onClick={sendMessageHandler}
                  >
                    {message.trim() ? (
                      <svg viewBox="0 0 24 24" width="24" height="24" className={darkMode ? "text-blue-400" : "text-blue-500"}>
                        <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
                      </svg>
                    ) : (
                      <FaMicrophone />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className={`p-6 rounded-lg text-center ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md max-w-md`}>
                <IoMdCheckmarkCircle className="text-4xl mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-medium mb-2">Department Communication</h3>
                <p className="mb-4">Select another department head to start chatting.</p>
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>All messages are end-to-end encrypted</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Department Overview</h2>
            <p>Summary of key metrics and updates will appear here.</p>
          </div>
        );
      case "chat":
        return <ChatLayout />;
      case "tasks":
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Task Management</h2>
            <p>Task assignment and tracking system will appear here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <div className="flex flex-grow">
        {!isSidebarVisible && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

        <main className="flex-grow p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold font-poppins">Hello {firstname},</h1>
              <span className={`flex items-center ${statusStyles.bg} ${statusStyles.text} text-sm font-semibold px-2.5 py-0.5 rounded-full animate-pulse`}>
                <span className={`w-2 h-2 ${statusStyles.dot} rounded-full mr-1.5`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 text-white text-lg px-4 py-2 rounded-lg cursor-pointer">
                Share
              </button>
              <FiMoreHorizontal className="text-gray-400 text-xl cursor-pointer" />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>

          <div className={`${darkMode ? "bg-[#064979]" : "bg-[#022847]"} rounded-lg shadow-lg p-2 mb-8 -mt-4`}>
            {renderEmployeeCount()}
          </div>

          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 -mt-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === "overview" 
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === "chat" 
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === "tasks" 
                ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
          </div>

          <div className={`rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"} p-6 shadow`} style={{ minHeight: '500px' }}>
            <TabContent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepartmentheadFood;