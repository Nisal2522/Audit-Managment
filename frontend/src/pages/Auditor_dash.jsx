
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Clock from "../components/Clock"
import {useAuditStore} from "../store/useAuditStore";
import { findNextNearestDate , formatMongoDate } from "../utils/auditUtils";
 


const Auditor_dash = () => {
  const { getAudit, auditData, isLoading } = useAuditStore();

  useEffect(() => {
    const id = "AUD1234";
    getAudit(id); 
  }, [getAudit]);

 
  if (isLoading || !auditData) {
    return <div>Loading...</div>;
  }
  console.log("Audit Data:", auditData); 

  
  const nearestDateInfo = Array.isArray(auditData) && auditData.length > 0 ? findNextNearestDate(auditData): null;

  console.log("Nearest Date Info:", nearestDateInfo);
  return (
    <div className="h-screen bg-base-200">
      
      <Navbar />

      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">
          
          <div
            style={{ backgroundColor: "#022847", color: "white" }}
            className="rounded-lg flex justify-between p-4 mt-4 mb-4 transition-colors group-hover:bg-primary/20"
          >
            <div>
              <h1 className="text-2xl">Hello, Manuga Romal</h1>
              <p className="text-sm text-green-600 font-semibold mt-2">
                🟢 Active
              </p>
            </div>
            <div>
              <Clock /> 
            </div>
          </div>

          
          {nearestDateInfo ? (
  <div
    className="p-4 mb-4 rounded-lg cursor-pointer"
    style={{ backgroundColor: "#022847", color: "white" }}
    onClick={() => (window.location.href = "")}
  >
<h2 className="text-3xl font-semibold text-white mb-6">
  Your {nearestDateInfo.diff === 0
    ? "Next Audit: Today!!"
    : `Next Audit in : ${nearestDateInfo.diff} day${nearestDateInfo.diff === 1 ? "" : "s"}`
  }
</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-2 text-white">
      <div className="space-y-4">
        <p ><span className="font-semibold">Date : </span> <br/>{formatMongoDate(nearestDateInfo?.date)}</p>
        <p className="font-bold">Unit Location<br/>Location : </p>
        <p className="font-semibold">Unit :</p>
        
      </div>
      <div className="space-y-4">
        <p><span className="font-semibold">Audit Type:</span> Remote</p>
        <p><span className="font-semibold">Program:</span> GOTS/OCS/GRS/RCS</p>
        <p><span className="font-semibold">Audit Status:</span> Confirmed</p>
        <p><span className="font-semibold">Inspection:</span> Remote</p>
      </div>
      <div className="space-y-4">
        
        <p><span className="font-semibold">Program:</span> GOTS/OCS/GRS/RCS</p>
        <p><span className="font-semibold">Audit Status:</span> Confirmed</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p>Submit Audit Report</p>
      </div>
    </div>
  </div>
) : (
  <p>No future dates available</p>
)}


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

