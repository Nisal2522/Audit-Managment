import React, { useState, useEffect } from 'react';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import { FiSearch } from 'react-icons/fi';

const PlannerAuditsPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/planneraudits');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch audits');
        }
        const data = await response.json();
        if (data.success) {
          console.log('Total audits received:', data.data.length);
          setAudits(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch audits');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching audits:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAudits();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter audits based on search term
  const filteredAudits = audits.filter(audit =>
    audit.customId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.auditorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('Filtered audits count:', filteredAudits.length);

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* NavBar stays fixed at top */}
      <NavBar toggleSidebar={toggleSidebar} />

      {/* Sidebar - fixed to the left */}
      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      {/* Main Content */}
      <div className={`transition-all duration-300 p-6 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center mb-6">
          Planner Audits Management
        </h1>

        {/* Search Bar */}
        <div className="flex-grow flex justify-center mb-4 mx-4">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            />
            <FiSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          {loading ? (
            <div className="text-center p-4 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          ) : filteredAudits.length === 0 ? (
            <div className="text-center p-4 text-gray-400">No audits found</div>
          ) : (
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  <table className="min-w-full table-fixed divide-y divide-gray-600 bg-gray-700">
                    <thead className="bg-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Custom ID</th>
                        <th className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">Project Name</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Unit</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Location</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Program</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Audit Type</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Inspection Type</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Status</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Start Date</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">End Date</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Impartiality</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Auditor ID</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Auditor Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {filteredAudits.map((audit) => (
                        <tr key={audit._id} className="hover:bg-gray-500">
                          <td className="w-32 px-4 py-3 text-center whitespace-nowrap text-white">{audit.customId}</td>
                          <td className="w-48 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{audit.projectName}</td>
                          <td className="w-32 px-4 py-3 text-center text-white">{audit.unitLocation?.unit}</td>
                          <td className="w-32 px-4 py-3 text-center text-white">{audit.unitLocation?.location}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{audit.program}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{audit.auditType}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{audit.inspectionType}</td>
                          <td className="w-32 px-4 py-3 text-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${audit.auditStatus === 'Completed' ? 'bg-green-100 text-green-800' : 
                                audit.auditStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                                audit.auditStatus === 'Pending' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {audit.auditStatus === 'Contract Created' ? 'Pending' : audit.auditStatus}
                            </span>
                          </td>
                          <td className="w-32 px-4 py-3 text-center text-white">{formatDate(audit.startDate)}</td>
                          <td className="w-32 px-4 py-3 text-center text-white">{formatDate(audit.endDate)}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{audit.impartialityAssessment || 'N/A'}</td>
                          <td className="w-32 px-4 py-3 text-center text-white">{audit.auditorId}</td>
                          <td className="w-40 px-4 py-3 text-center text-white">{audit.auditorName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlannerAuditsPage; 