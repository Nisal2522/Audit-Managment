import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const RequestLeaveFood = () => {
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employeeName: "John Doe", leaveType: "Sick Leave", startDate: "2025-03-20", endDate: "2025-03-22", status: "Pending", reason: "Fever and flu symptoms. Advised by a doctor to rest." },
    { id: 2, employeeName: "Jane Smith", leaveType: "Vacation Leave", startDate: "2025-04-10", endDate: "2025-04-15", status: "Approved", reason: "Family vacation planned for a long time." },
    { id: 3, employeeName: "Emily Davis", leaveType: "Personal Leave", startDate: "2025-02-10", endDate: "2025-02-12", status: "Rejected", reason: "Unapproved absence." },
    { id: 4, employeeName: "Michael Johnson", leaveType: "Sick Leave", startDate: "2025-03-01", endDate: "2025-03-03", status: "Pending", reason: "Cold and cough symptoms." },
    { id: 5, employeeName: "Lucas Brown", leaveType: "Sick Leave", startDate: "2025-03-05", endDate: "2025-03-07", status: "Pending", reason: "Stomach flu, resting at home." },
    { id: 6, employeeName: "Olivia White", leaveType: "Maternity Leave", startDate: "2025-05-01", endDate: "2025-05-30", status: "Approved", reason: "Maternity leave after childbirth." },
    { id: 7, employeeName: "James Wilson", leaveType: "Vacation Leave", startDate: "2025-06-15", endDate: "2025-06-20", status: "Approved", reason: "Vacation planned months ago." },
    { id: 8, employeeName: "Sophia Martinez", leaveType: "Sick Leave", startDate: "2025-03-25", endDate: "2025-03-27", status: "Rejected", reason: "Cold symptoms, did not follow procedure." },
    { id: 9, employeeName: "Benjamin Clark", leaveType: "Personal Leave", startDate: "2025-07-10", endDate: "2025-07-12", status: "Pending", reason: "Family emergency." },
    { id: 10, employeeName: "Isabella Lewis", leaveType: "Sick Leave", startDate: "2025-02-15", endDate: "2025-02-17", status: "Approved", reason: "Migraine and severe headache." },
    { id: 11, employeeName: "Elijah Young", leaveType: "Vacation Leave", startDate: "2025-08-01", endDate: "2025-08-07", status: "Approved", reason: "Annual family vacation." },
    { id: 12, employeeName: "Amelia Walker", leaveType: "Personal Leave", startDate: "2025-03-18", endDate: "2025-03-19", status: "Rejected", reason: "Unapproved absence, did not notify." },
    { id: 13, employeeName: "William Hall", leaveType: "Sick Leave", startDate: "2025-04-01", endDate: "2025-04-03", status: "Pending", reason: "Recovering from surgery." },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleRowClick = (request) => setSelectedRequest(request);
  const closeCard = () => setSelectedRequest(null);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const updateStatus = (id, newStatus) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
    setSelectedRequest(null);
  };

  const pendingRequests = leaveRequests.filter(req => req.status === "Pending");
  const previousRequests = leaveRequests.filter(req => req.status !== "Pending");

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-8 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'} shadow-lg`}>
              Request Leave
            </label>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Pending Requests */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Pending Requests</h3>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200 dark:border-gray-600">
                <thead>
                  <tr className="bg-blue-500 text-white text-left">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Leave Type</th>
                    <th className="py-3 px-6">Start Date</th>
                    <th className="py-3 px-6">End Date</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? "bg-gray-500" : "bg-white"}>
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer transition" onClick={() => handleRowClick(request)}>
                      <td className="py-3 px-6">{request.employeeName}</td>
                      <td className="py-3 px-6">{request.leaveType}</td>
                      <td className="py-3 px-6">{request.startDate}</td>
                      <td className="py-3 px-6">{request.endDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Previous Requests */}
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Previous Requests</h3>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200 dark:border-gray-600">
                <thead>
                  <tr className="bg-blue-500 text-white text-left">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Leave Type</th>
                    <th className="py-3 px-6">Start Date</th>
                    <th className="py-3 px-6">End Date</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? "bg-gray-500" : "bg-white"}>
                  {previousRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-600 dark:hover:bg-gray-700 cursor-pointer transition" onClick={() => handleRowClick(request)}>
                      <td className="py-3 px-6">{request.employeeName}</td>
                      <td className="py-3 px-6">{request.leaveType}</td>
                      <td className="py-3 px-6">{request.startDate}</td>
                      <td className="py-3 px-6">{request.endDate}</td>
                      <td className={`py-3 px-6 font-bold ${request.status === "Approved" ? "text-green-500" : request.status === "Rejected" ? "text-red-500" : "text-yellow-500"}`}>
                        {request.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

         {/* Selected Request Details */}
                    {selectedRequest && (
                      <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="bg-white dark:bg-gray-800 text-black dark:text-white w-1/3 p-6 rounded-lg shadow-lg">
                          <h2 className="text-2xl font-bold mb-4">{selectedRequest.employeeName}'s Leave Request</h2>
                          <p><strong>👤 Employee:</strong> {selectedRequest.employeeName}</p> 
                          <p><strong>📃 Type:</strong> {selectedRequest.leaveType}</p>
                          <p><strong>📅 Start Date:</strong> {selectedRequest.startDate}</p>
                          <p><strong>📅 End Date:</strong> {selectedRequest.endDate}</p>
                          <p className="border-l-4 pl-2"><strong>✍️ Reason:</strong> {selectedRequest.reason}</p>

                          {/* Approval / Rejection / Close Buttons */}
                          {selectedRequest.status === "Pending" ? (
                            <div className="mt-4 flex space-x-4">
                              <button
                                onClick={() => updateStatus(selectedRequest.id, "Approved")}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(selectedRequest.id, "Rejected")}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          ) : null}

                          {/* Close Button */}
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={closeCard}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
                            >
                              Close
                        </button>
                    </div>
                </div>
        </motion.div>
          )}

        </main>
      </div>
    </div>
  );
};

export default RequestLeaveFood;
