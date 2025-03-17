import React, { useState } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";

const employees = [
  { id: 1, name: "John Doe", status: "active", online: true, img: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jane Smith", status: "active", online: false, img: "https://randomuser.me/api/portraits/women/2.jpg" },
  { id: 3, name: "Michael Johnson", status: "inactive", online: false, img: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Emily Davis", status: "inactive", online: true, img: "https://randomuser.me/api/portraits/women/4.jpg" },
  { id: 5, name: "Sarah Brown", status: "active", online: true, img: "https://randomuser.me/api/portraits/women/5.jpg" },
  { id: 6, name: "David Wilson", status: "inactive", online: true, img: "https://randomuser.me/api/portraits/men/6.jpg" },
  { id: 7, name: "Olivia Martinez", status: "active", online: true, img: "https://randomuser.me/api/portraits/women/7.jpg" },
  { id: 8, name: "William Anderson", status: "inactive", online: false, img: "https://randomuser.me/api/portraits/men/8.jpg" },
  { id: 9, name: "Dasindu Dinsara", status: "active", online: true, img: "https://randomuser.me/api/portraits/men/9.jpg" },
  { id: 10, name: "Rilz Wrash", status: "active", online: false, img: "https://randomuser.me/api/portraits/men/10.jpg" },
];

const EmployeeStatusFood = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [statusTab, setStatusTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.status.toLowerCase().includes(searchQuery.toLowerCase())) &&
      emp.status === activeTab &&
      (statusTab === null || (statusTab === "online" ? emp.online : !emp.online))
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar />
     
      <div className="flex flex-grow">
        <Sidebar />
        <main className={`flex-grow p-8 rounded-lg shadow-xl ${darkMode ? "bg-gray-900" : "bg-white"}`}>
               <div className="flex justify-between items-center mb-6">
               <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'} shadow-lg`}>
              Employee Status
            </label>
                  <div className="flex items-center space-x-4"> 
                  <input
                    type="text"
                    placeholder="Search employees by name"
                    className={`w-60 p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                    <button
                      onClick={toggleDarkMode}
                      className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
                      >
                      {darkMode ? "☀️ " : "🌙 "}
                    </button>
                  </div>
                </div>

          
          <div className="flex border-b mb-6 space-x-6">
            {[{ id: "active", label: "Active Members" }, { id: "inactive", label: "Inactive Members" }].map(
              (tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-lg font-medium ${activeTab === tab.id ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              )
            )}
          </div>

          {activeTab === "active" && (
            <div className="flex border-b mb-6 space-x-6">
              {[{ id: "online", label: "Online" }, { id: "offline", label: "Offline" }].map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 text-lg font-medium ${statusTab === tab.id ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-600"}`}
                  onClick={() => setStatusTab(statusTab === tab.id ? null : tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          
          <div className="mt-6">
            <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}>
              <h2 className="text-2xl font-semibold">
                {activeTab === "active" ? "Active Members" : "Inactive Members"}
              </h2>
              {filteredEmployees.length > 0 ? (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEmployees.map((emp) => (
                    <li
                      key={emp.id}
                      className={`p-6 rounded-xl shadow-lg border flex items-center space-x-4 hover:scale-105 transition-transform duration-300 ${darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-900"}`}
                    >
                      <img src={emp.img} alt={emp.name} className="w-12 h-12 rounded-full border-2 border-gray-300" />
                      <div className="flex flex-col">
                        <span className="font-medium text-lg">{emp.name}</span>
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${emp.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>{emp.status}</span>
                      </div>
                      {emp.status === "active" && (
                        <span className={`px-3 py-1 text-xs rounded-full font-bold ${emp.online ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"}`}>{emp.online ? "🟢 Online" : "🔴 Offline"}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4">No employees found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeStatusFood;
