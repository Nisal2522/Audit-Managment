import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { FiShare2, FiMoreHorizontal, FiSun, FiMoon } from "react-icons/fi";
import Sidebar from "../../../components/Sidebar";
import Navbar from '../../../components/NavBar';
import {  FaSun, FaMoon } from "react-icons/fa";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DepartmentheadFood = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [darkMode, setDarkMode] = useState(false);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const chartData = {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Performance",
        data: [90, 25, 60],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  // Members Data
  const members = [
    { id: 1, name: "User 1", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "User 2", img: "https://randomuser.me/api/portraits/women/45.jpg" },
    { id: 3, name: "User 3", img: "https://randomuser.me/api/portraits/men/50.jpg" },
    { id: 4, name: "User 4", img: "https://randomuser.me/api/portraits/women/55.jpg" }
  ];


  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />

      <div className="flex flex-grow">
        {/* Sidebar */}
        {!isSidebarVisible && <Sidebar />}

        <main className="flex-grow p-8 rounded-lg shadow-md">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-semibold text-[#022847]">Hello Nisal,</h1>
              <span className="flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded-full animate-pulse">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>
                Active
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#022847] text-white text-lg px-4 py-2 rounded-lg cursor-pointer">
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

          {/* Members Count Section */}
          <div
            className={`flex items-center space-x-3 px-4 py-2 rounded-lg inline-block text-sm font-medium mb-6 ${
              darkMode ? "bg-teal-300 text-black" : "bg-[#022847] text-white"
            }`}
          >
            {/* Profile Images */}
            <div className="flex -space-x-2">
              {members.map((member) => (
                <img
                  key={member.id}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  src={member.img}
                  alt={member.name}
                />
              ))}
            </div>
            <span>
              <span className="font-semibold">Dasindu</span> +{" "}
              <span className="font-semibold">{20 - members.length} others</span>
            </span>
          </div>

          {/* Tabs Section */}
          <div className="flex border-b">
            {["overview", "report", "settings"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-lg font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    "Ongoing Audits",
                    "Completed Audits",
                    "Pending Leaves",
                    "Resolved Issues",
                  ].map((title, index) => (
                    <div key={index} className="p-6 rounded-lg shadow-lg bg-[#022847]">
                      <p className="text-white">{title}</p>
                      <h2 className="text-white text-3xl font-bold">
                        {[25, 50, 8, 20][index]}
                      </h2>
                      <p className="text-green-400 text-lg font-medium mt-1">
                        {["+5%", "+10%", "-2%", "+15%"][index]}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  {["Audit Completion Rate", "Issue Resolution Rate"].map(
                    (title, index) => (
                      <div key={index} className="p-6 rounded-lg shadow-lg bg-[#022847]">
                        <h3 className="text-xl text-white font-semibold mb-4">
                          {title}
                        </h3>
                        <div className="flex items-center mb-4">
                          <span className="text-3xl font-bold text-white">
                            {[75, 55][index]}%
                          </span>
                          <span className="text-sm text-blue-400 ml-2">
                            {["+5%", "-5%"][index]}
                          </span>
                        </div>
                        <Line data={chartData} />
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            {activeTab === "report" && (
              <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">Reports Section</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Report details will be displayed here.
                </p>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-6 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Configure your preferences here.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DepartmentheadFood;
