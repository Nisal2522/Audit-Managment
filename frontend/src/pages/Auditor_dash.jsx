

// const Auditor_dash = () => {

//   const{getAudit ,auditData ,isLoading } = useAuditStore();
//   useEffect(() => {
//     const id = "AUD1234";
//     getAudit(id);
//   } , [getAudit]);
  
//   if (isLoading) {
//     return <div>Loading...</div>; // Show a spinner/skeleton
//   }

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Clock from "../components/Clock"
import {useAuditStore} from "../store/useAuditStore";





const Auditor_dash = () => {

  const{getAudit ,auditData ,isLoading } = useAuditStore();
  useEffect(() => {
    const id = "AUD1234";
    getAudit(id);
  } , [getAudit]);
  
  if (isLoading) {
    return <div>Loading...</div>; // Show a spinner/skeleton
  }

  return (
    <div className="h-screen bg-base-200">
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          {/* Greeting Section */}
          <div
            style={{ backgroundColor: "#022847", color: "white" }}
            className="rounded-lg flex justify-between p-4 mt-4 mb-4 transition-colors group-hover:bg-primary/20"
          >
            <div>
              <h1 className="text-xl font-bold">Hello, Manuga Romal</h1>
              <p className="text-sm text-green-600 font-semibold mt-2">
                🟢 Active
              </p>
            </div>
            <div>
              <Clock /> {/* Fixed clock display */}
            </div>
          </div>

          {/* Next Audit Section */}
          <div
            className="p-4 mb-4 rounded-lg cursor-pointer"
            style={{ backgroundColor: "#022847", color: "white" }}
            onClick={() => (window.location.href = "/audit-details")}
          >
            <h2 className="text-lg font-bold text-white underline mb-2">
              Next Audit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
              <div>
                <p>📅 <span className="font-semibold">Date:</span>{auditData.startDate}</p>
                <p>📍 <span className="font-semibold">Place:</span> TBD</p>
                <p>🏢 <span className="font-semibold">Company Type:</span> TBD</p>
              </div>
              <div>
                <p>🔍 <span className="font-semibold">Audit Type:</span> Remote</p>
                <p>📜 <span className="font-semibold">Program:</span> GOTS/OCS/GRS/RCS</p>
                <p>✅ <span className="font-semibold">Audit Status:</span> Confirmed</p>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <div
            style={{ backgroundColor: "#022847", color: "black" }}
            className="bg-primary/10 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
          >
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-bold text-lg">Total Audits</p>
              <p>15 Completed</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-bold text-lg">Upcoming Audits</p>
              <p>3 Scheduled</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-bold text-lg">Pending Issues</p>
              <p>5 Critical</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-bold text-lg">Completed Reviews</p>
              <p>8 Approved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auditor_dash;

