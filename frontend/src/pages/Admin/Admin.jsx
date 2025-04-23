import React, { useState, useEffect, useRef } from 'react';
import { getDashboardStats } from '../../services/admin';
import { 
  FaUsers, 
  FaLock, 
  FaCheckCircle,
  FaSun, 
  FaMoon,
  FaBell,
  FaUserPlus,
  FaUserCog,
  FaKey,
  FaTimes,
  FaCalendarAlt,
  FaHistory,
  FaComments,
  FaThLarge,
  FaSearch,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone
} from "react-icons/fa";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Navbar from "../../Components/NavBar";
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';

const Systemadmin = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dailyStats, setDailyStats] = useState([]);
  const [showDailyStats, setShowDailyStats] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [departmentHeads, setDepartmentHeads] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [unreadCounts, setUnreadCounts] = useState({});
  const activitiesPerPage = 4;
  const searchInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
  const ADMIN_PASSWORD = "admin@123";

  // Focus management
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.location.href = "/Admin/Reset-Password";
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/daily-activity-stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDailyStats(response.data);
    } catch (error) {
      console.error('Error fetching daily stats:', error);
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

  const fetchDepartmentHeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/department-heads`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDepartmentHeads(response.data);
      await fetchUnreadCounts();
    } catch (error) {
      console.error('Error fetching department heads:', error);
    }
  };

  const fetchMessages = async (employeeId) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/messages/${employeeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Get current user ID from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const currentEmployeeId = currentUser.employeeid;
    
      // Process messages with proper alignment
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
            senderName: isSentByCurrentUser ? 'You' : ""
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
      // Get the current user's data from localStorage
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      const senderEmployeeId = userData.employeeid || '';
      const senderPosition = userData.position || '';
  
      await axios.post(`${API_URL}/api/admin/send-message`, {
        employeeId: selectedChat.employeeId, // Receiver's ID
        message: message.trim(),
        senderEmployeeId: senderEmployeeId, // Sender's ID
        sender: senderPosition.toLowerCase().includes('admin') ? 'admin' : 'department_head'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Refresh the messages
      await fetchMessages(selectedChat.employeeId);
      
      // Clear the input and focus it again
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
    setSelectedChat({
      _id: head._id || head.id,
      profilePic: head.profilePic,
      name: `${head.firstname || ''} ${head.lastname || ''}`.trim(),
      employeeId: head.employeeid,
      lastMessage: "Start chatting",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    // Fetch unread counts whenever we select a new chat
    await fetchUnreadCounts();
  };

  const filteredHeads = departmentHeads.filter(head => {
    const fullName = `${head.firstname || ''} ${head.lastname || ''}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const indexOfLastActivity = currentPage * activitiesPerPage;
  const indexOfFirstActivity = indexOfLastActivity - activitiesPerPage;
  const currentActivities = activityLog.slice(indexOfFirstActivity, indexOfLastActivity);
  const totalPages = Math.ceil(activityLog.length / activitiesPerPage);

  const recentActivitiesCount = dailyStats.reduce((sum, day) => sum + (day.total || 0), 0);

  const MetricCard = ({ icon, title, value, trend, onClick }) => (
    <div 
      className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-[#064979]"} ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold text-white`}>{title}</p>
          <p className={`text-2xl font-bold text-white`}>{value}</p>
          {trend && (
            <span className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}></span>
          )}
        </div>
      </div>
    </div>
  );

  const QuickAccessWidget = ({ icon, title, description, onClick }) => (
    <div 
      className={`p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${darkMode ? "bg-[#064979] hover:bg-[#022847]" : "bg-[#064979] hover:bg-[#022847]"}`}
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className={`p-3 rounded-full mr-4 ${darkMode ? "bg-white" : "bg-white"}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className={`text-sm mt-1 ${darkMode ? "text-white" : "text-white"}`}>{description}</p>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div className="flex items-start pb-3 border-b border-gray-200 dark:border-gray-700">
      <div className={`p-2 rounded-full mr-3 ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
        <IoMdCheckmarkCircle className={darkMode ? "text-blue-400" : "text-blue-600"} />
      </div>
      <div>
        <p className="font-medium">
          {activity.action === 'password_reset' ? 'Password Reset' : 
           activity.action === 'account_update' ? 'Account Updated' : activity.action}
        </p>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {activity.time} • {activity.user} ({activity.department}) <span className={`underline ${darkMode ? "text-blue-300" : "text-blue-600"}`}>{activity.employeeid}</span>
        </p>
      </div>
    </div>
  );

  const DailyActivityModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-poppins">
      <div className={`p-6 rounded-lg shadow-lg w-11/12 max-w-4xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            <FaCalendarAlt className="inline mr-2" /> Recent Activities
          </h3>
          <button 
            onClick={() => setShowDailyStats(false)}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-200 text-gray-800"}`}
          >
            <FaTimes />
          </button>
        </div>
        
        {dailyStats.length > 0 ? (
          <div className="overflow-auto max-h-96">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  <th className="p-3 text-left">Password Resets</th>
                  <th className="p-3 text-left">Account Updates</th>
                  <th className="p-3 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.map((day, index) => {
                  const resets = day.activities?.find(a => a.type === 'password_reset')?.count || 0;
                  const updates = day.activities?.find(a => a.type === 'account_update')?.count || 0;
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <td className="p-3">{resets}</td>
                      <td className="p-3">{updates}</td>
                      <td className="p-3 font-semibold">{day.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No daily activity data available
          </p>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowDailyStats(false)}
            className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-800"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

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
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
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
                No department heads found
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
                <FaComments className="text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">AuditChat for Admin</h3>
                <p className="mb-4">Send and receive messages with department heads without keeping your phone online.</p>
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>End-to-end encrypted</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleCreateAccount = () => {
    window.location.href = "/Admin/create-account";
  };

  const handleManageAccount = () => {
    window.location.href = "/Admin/manage-accounts";
  };

  const handleResetPassword = () => {
    setShowPasswordModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [statsData, activityResponse] = await Promise.all([
          getDashboardStats(),
          axios.get(`${API_URL}/api/admin/activity-log`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        
        setStats(statsData);
        setActivityLog(activityResponse.data);
        await fetchDailyStats();
        await fetchDepartmentHeads();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-red-900 text-red-100" : "bg-red-100 text-red-900"}`}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      <div className="flex">
        {!isSidebarVisible && (
          <div className="flex w-64">
            <Sidebar />
          </div>
        )}
        <div className="flex-1 px-4 py-8">
          {showPasswordModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-poppins">
              <div className={`p-6 rounded-lg shadow-lg w-96 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
                  Enter Admin Password
                </h3>
                <form onSubmit={handlePasswordSubmit}>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    className={`w-full p-2 border rounded mb-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
                    placeholder="Enter admin password"
                    required
                  />
                  {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPassword('');
                        setPasswordError('');
                      }}
                      className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white hover:bg-gray-700" : "bg-gray-300 text-gray-800 hover:bg-gray-400"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showDailyStats && <DailyActivityModal />}

          <div className="flex justify-between items-center mb-8 font-poppins">
            <h1 className={`text-2xl font-bold py-2 px-4 rounded-lg ${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white`}>
              Admin Dashboard
            </h1>
            <div className="flex items-center">
              <div className={`flex rounded-lg overflow-hidden mr-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 flex items-center ${activeTab === 'overview' ? (darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white") : (darkMode ? "text-gray-300" : "text-gray-700")}`}
                >
                  <FaThLarge className="mr-2" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 flex items-center ${activeTab === 'chat' ? (darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white") : (darkMode ? "text-gray-300" : "text-gray-700")}`}
                >
                  <FaComments className="mr-2" /> Chat
                </button>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors"
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 font-poppins">
                <MetricCard 
                  icon={<FaUsers className={darkMode ? "text-blue-400" : "text-blue-600"} />}
                  title="Total Department Heads" 
                  value={stats?.totalHeads || 0} 
                  trend="up"
                />
                <MetricCard 
                  icon={<FaCheckCircle className={darkMode ? "text-green-400" : "text-green-600"} />}
                  title="Active Accounts" 
                  value={stats?.activeAccounts || 0} 
                />
                <MetricCard 
                  icon={<FaLock className={darkMode ? "text-red-400" : "text-red-600"} />}
                  title="Inactive Accounts" 
                  value={stats?.inactiveAccounts || 0} 
                  trend="down"
                />
                <MetricCard 
                  icon={<FaHistory className={darkMode ? "text-yellow-400" : "text-yellow-600"} />}
                  title="Recent Activities" 
                  value={recentActivitiesCount} 
                  onClick={() => setShowDailyStats(true)}
                />
              </div>

              <div className="mb-8 font-poppins">
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <QuickAccessWidget
                    icon={<FaUserPlus className={darkMode ? "text-blue-400" : "text-blue-600"} size={20} />}
                    title="Create Account"
                    description="Add a new department head account"
                    onClick={handleCreateAccount}
                  />
                  <QuickAccessWidget
                    icon={<FaUserCog className={darkMode ? "text-blue-400" : "text-blue-600"} size={20} />}
                    title="Manage Account"
                    description="Edit or deactivate user accounts"
                    onClick={handleManageAccount}
                  />
                  <QuickAccessWidget
                    icon={<FaKey className={darkMode ? "text-blue-400" : "text-blue-600"} size={20} />}
                    title="Reset Password"
                    description="Reset a user's password"
                    onClick={handleResetPassword}
                  />
                </div>
              </div>

              <div className={`p-6 rounded-lg font-poppins shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className={`text-xl font-semibold mb-4 flex items-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                  <FaBell className="mr-2" /> Recent Activity
                </h2>
                <div className="space-y-3 mb-4">
                  {currentActivities.length > 0 ? (
                    currentActivities.map((activity, index) => (
                      <ActivityItem key={index} activity={activity} />
                    ))
                  ) : (
                    <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      No recent activity
                    </p>
                  )}
                </div>
                
                {activityLog.length > activitiesPerPage && (
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded ${darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white"} ${
                        currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    <span className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded ${darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white"} ${
                        currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <ChatLayout />
          )}
        </div>
      </div>
    </div>
  );
};

export default Systemadmin;