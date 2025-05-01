import React, { useState, useEffect } from 'react';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import ExportModal from '../../../components/ExportModal';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

const PendingContracts = () => {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [audits, setAudits] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    customId: '',
    projectName: '',
    unit: '',
    location: '',
    program: '',
    auditType: '',
    auditStatus: '',
    auditorId: '',
    auditorName: ''
  });

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleRowClick = (audit) => {
    // Prepare the data to pass to ContractCreation
    const contractData = {
      customId: audit.customId,
      projectName: audit.projectName,
      unit: audit.unitLocation.unit,
      location: audit.unitLocation.location,
      program: audit.program,
      auditType: audit.auditType,
      auditorId: audit.auditorId,
      auditorName: audit.auditorName,
      startDate: audit.startDate,
      endDate: audit.endDate,
      status: audit.auditStatus
    };

    console.log("Passing data to ContractCreation:", contractData);
    // Navigate to ContractCreation with the data
    navigate('/ContractCreation', { state: contractData });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch audits
        const response = await fetch('http://localhost:5005/api/planneraudits');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch audits');
        }
        const data = await response.json();

        // Fetch contracts
        const contractsResponse = await fetch('http://localhost:5005/api/contractor/readcontract');
        if (!contractsResponse.ok) {
          throw new Error('Failed to fetch contracts');
        }
        const contractsData = await contractsResponse.json();
        setContracts(contractsData);
        
        const contractCustomIds = new Set(contractsData.map(contract => contract.customId));

        if (data.success) {
          // Filter audits: only pending/in-progress AND not having a contract
          const pendingAudits = data.data.filter(audit => 
            (audit.auditStatus === 'Pending' || audit.auditStatus === 'In Progress') &&
            !contractCustomIds.has(audit.customId)
          );

          // Sort audits by emergency (start date) - earlier dates first
          const sortedAudits = pendingAudits.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return dateA - dateB;
          });

          setAudits(sortedAudits);
        } else {
          throw new Error(data.message || 'Failed to fetch audits');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Calculate days until start date
  const getDaysUntilStart = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle filter changes
  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  // Filter audits based on all filters
  const filteredAudits = audits.filter(audit => {
    return (
      audit.customId?.toLowerCase().includes(filters.customId.toLowerCase()) &&
      audit.projectName?.toLowerCase().includes(filters.projectName.toLowerCase()) &&
      audit.unitLocation?.unit?.toLowerCase().includes(filters.unit.toLowerCase()) &&
      audit.unitLocation?.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
      audit.program?.toLowerCase().includes(filters.program.toLowerCase()) &&
      audit.auditType?.toLowerCase().includes(filters.auditType.toLowerCase()) &&
      audit.auditStatus?.toLowerCase().includes(filters.auditStatus.toLowerCase()) &&
      audit.auditorId?.toLowerCase().includes(filters.auditorId.toLowerCase()) &&
      audit.auditorName?.toLowerCase().includes(filters.auditorName.toLowerCase())
    );
  });

  const documentTypes = [
    { value: 'critical', label: 'Critical Priority Contracts' },
    { value: 'normal', label: 'Normal Priority Contracts' }
  ];

  const auditColumns = [
    { key: 'Custom ID', header: 'Custom ID' },
    { key: 'Project Name', header: 'Project Name' },
    { key: 'Unit', header: 'Unit' },
    { key: 'Location', header: 'Location' },
    { key: 'Program', header: 'Program' },
    { key: 'Audit Type', header: 'Audit Type' },
    { key: 'Status', header: 'Status' },
    { key: 'Start Date', header: 'Start Date' },
    { key: 'End Date', header: 'End Date' },
    { key: 'Auditor ID', header: 'Auditor ID' },
    { key: 'Auditor Name', header: 'Auditor Name' },
    { key: 'Emergency Level', header: 'Emergency Level' },
    { key: 'Days Until Start', header: 'Days Until Start' }
  ];

  const handleExport = (exportType, documentType) => {
    // Filter audits based on emergency level
    const filteredAudits = audits.filter(audit => {
      const daysUntilStart = getDaysUntilStart(audit.startDate);
      if (documentType === 'critical') return daysUntilStart <= 90;
      if (documentType === 'normal') return daysUntilStart > 90;
      return false;
    });

    // Format the data for export
    const exportData = filteredAudits.map(audit => ({
      'Custom ID': audit.customId,
      'Project Name': audit.projectName,
      'Unit': audit.unitLocation?.unit || '',
      'Location': audit.unitLocation?.location || '',
      'Program': audit.program,
      'Audit Type': audit.auditType,
      'Status': audit.auditStatus,
      'Start Date': formatDate(audit.startDate),
      'End Date': formatDate(audit.endDate),
      'Auditor ID': audit.auditorId,
      'Auditor Name': audit.auditorName,
      'Emergency Level': getDaysUntilStart(audit.startDate) <= 90 ? 'Critical' : 'Normal',
      'Days Until Start': getDaysUntilStart(audit.startDate)
    }));

    const fileName = `${documentType}_pending_contracts_${new Date().toISOString().split('T')[0]}`;

    if (exportType === 'excel') {
      exportToExcel(exportData, fileName);
    } else {
      exportToPDF(exportData, fileName, auditColumns);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      <NavBar toggleSidebar={toggleSidebar} />

      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}
      
      <div className={`transition-all duration-300 p-6 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Download size={20} />
            Export
          </button>
        </div>

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          documentTypes={documentTypes}
          title="Export Pending Contracts"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
          {/* Total Contracts Created */}
          <div 
            onClick={() => navigate('/ContractStatus')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold mb-2 text-center">
              Total Contracts Created
            </h3>
            <p className="text-4xl font-bold text-center text-blue-500">
              {contracts.length}
            </p>
          </div>

          {/* Remaining Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Remaining Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-orange-500">
              {audits.length}
            </p>
          </div>

          {/* Approved Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Approved Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-green-500">
              0
            </p>
          </div>

          {/* Rejected Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Rejected Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-red-500">
              0
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
        bg-clip-text text-transparent mb-3 mt-6 text-center">Pending Contracts
        </h2>

        {/* Filter Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 px-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Custom ID</label>
            <input
              type="text"
              placeholder="Filter Custom ID"
              value={filters.customId}
              onChange={(e) => handleFilterChange('customId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Project Name</label>
            <input
              type="text"
              placeholder="Filter Project Name"
              value={filters.projectName}
              onChange={(e) => handleFilterChange('projectName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Unit</label>
            <input
              type="text"
              placeholder="Filter Unit"
              value={filters.unit}
              onChange={(e) => handleFilterChange('unit', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Location</label>
            <input
              type="text"
              placeholder="Filter Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Program</label>
            <input
              type="text"
              placeholder="Filter Program"
              value={filters.program}
              onChange={(e) => handleFilterChange('program', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Audit Type</label>
            <input
              type="text"
              placeholder="Filter Audit Type"
              value={filters.auditType}
              onChange={(e) => handleFilterChange('auditType', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Status</label>
            <input
              type="text"
              placeholder="Filter Status"
              value={filters.auditStatus}
              onChange={(e) => handleFilterChange('auditStatus', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Auditor ID</label>
            <input
              type="text"
              placeholder="Filter Auditor ID"
              value={filters.auditorId}
              onChange={(e) => handleFilterChange('auditorId', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Auditor Name</label>
            <input
              type="text"
              placeholder="Filter Auditor Name"
              value={filters.auditorName}
              onChange={(e) => handleFilterChange('auditorName', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md rounded-lg">
          {loading ? (
            <div className="text-center p-4 text-gray-400">Loading...</div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          ) : filteredAudits.length === 0 ? (
            <div className="text-center p-4 text-gray-400">No pending audits found</div>
          ) : (
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                  <table className="min-w-full table-fixed divide-y divide-gray-600 bg-gray-700">
                    <thead className="bg-gray-700 sticky top-0 z-10">
                      <tr>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Emergency Level</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Days Until Start</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Custom ID</th>
                        <th className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">Project Name</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Unit</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Location</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Program</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Audit Type</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Status</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Start Date</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">End Date</th>
                        <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">Auditor ID</th>
                        <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-white">Auditor Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {filteredAudits.map((audit) => {
                        const daysUntilStart = getDaysUntilStart(audit.startDate);
                        const isEmergency = daysUntilStart <= 90;

                        return (
                          <tr 
                            key={audit._id} 
                            className={`hover:bg-gray-500 cursor-pointer ${isEmergency ? 'bg-red-900/30' : ''}`}
                            onClick={() => handleRowClick(audit)}
                          >
                            <td className="w-32 px-4 py-3 text-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${daysUntilStart <= 90 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {daysUntilStart <= 90 ? 'Critical' : 'Normal'}
                              </span>
                            </td>
                            <td className="w-32 px-4 py-3 text-center text-white">{daysUntilStart} days</td>
                            <td className="w-32 px-4 py-3 text-center whitespace-nowrap text-white">{audit.customId}</td>
                            <td className="w-48 px-4 py-3 text-center text-white truncate hover:text-clip hover:whitespace-normal">{audit.projectName}</td>
                            <td className="w-32 px-4 py-3 text-center text-white">{audit.unitLocation?.unit}</td>
                            <td className="w-32 px-4 py-3 text-center text-white">{audit.unitLocation?.location}</td>
                            <td className="w-40 px-4 py-3 text-center text-white">{audit.program}</td>
                            <td className="w-40 px-4 py-3 text-center text-white">{audit.auditType}</td>
                            <td className="w-32 px-4 py-3 text-center">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${audit.auditStatus === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-orange-100 text-orange-800'}`}>
                                {audit.auditStatus}
                              </span>
                            </td>
                            <td className="w-32 px-4 py-3 text-center text-white">{formatDate(audit.startDate)}</td>
                            <td className="w-32 px-4 py-3 text-center text-white">{formatDate(audit.endDate)}</td>
                            <td className="w-32 px-4 py-3 text-center text-white">{audit.auditorId}</td>
                            <td className="w-40 px-4 py-3 text-center text-white">{audit.auditorName}</td>
                          </tr>
                        );
                      })}
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

export default PendingContracts; 