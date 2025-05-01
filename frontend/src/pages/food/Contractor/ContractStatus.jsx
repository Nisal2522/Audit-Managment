import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import { Download } from 'lucide-react';
import ExportModal from '../../../components/ExportModal';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

const ContractStatus = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [pendingAudits, setPendingAudits] = useState([]);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Separate filter states for each column
  const [filters, setFilters] = useState({
    customId: '',
    projectName: '',
    contractDate: '',
    auditStartDate: '',
    auditEndDate: '',
    auditDuration: '',
    offerDays: '',
    manDayCost: '',
    totalCost: '',
    totalCostLKR: ''
  });

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch contracts
        const contractResponse = await axios.get("http://localhost:5005/api/contractor/readcontract");
        console.log('API Response:', contractResponse.data);
        
        if (Array.isArray(contractResponse.data)) {
          setContracts(contractResponse.data);
        } else {
          console.error('Unexpected data format:', contractResponse.data);
          setError("Failed to load contracts. Please try again later.");
        }

        // Fetch pending audits
        const auditsResponse = await axios.get('http://localhost:5005/api/planneraudits');
        if (auditsResponse.data?.success) {
          const contractCustomIds = new Set(contractResponse.data.map(contract => contract.customId));
          
          // Filter only pending and in progress audits that don't have contracts
          const pendingAudits = auditsResponse.data.data.filter(audit => 
            (audit.auditStatus === 'Pending' || audit.auditStatus === 'In Progress') &&
            !contractCustomIds.has(audit.customId)
          );
          setPendingAudits(pendingAudits);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  // Handle filter changes
  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  // Filter contracts based on all filters
  const filteredContracts = contracts.filter(contract => {
    return (
      contract.customId.toLowerCase().includes(filters.customId.toLowerCase()) &&
      contract.projectName.toLowerCase().includes(filters.projectName.toLowerCase()) &&
      new Date(contract.contractDate).toLocaleDateString().includes(filters.contractDate) &&
      new Date(contract.auditStartDate).toLocaleDateString().includes(filters.auditStartDate) &&
      new Date(contract.auditEndDate).toLocaleDateString().includes(filters.auditEndDate) &&
      contract.auditDuration.toString().includes(filters.auditDuration) &&
      contract.offerDays.toString().includes(filters.offerDays) &&
      contract.manDayCost.toString().includes(filters.manDayCost) &&
      contract.totalCost.toString().includes(filters.totalCost) &&
      contract.totalCostLKR.toString().includes(filters.totalCostLKR)
    );
  });

  const documentTypes = [
    { value: 'approved', label: 'Approved Contracts' },
    { value: 'pending', label: 'Pending Contracts' },
    { value: 'rejected', label: 'Rejected Contracts' }
  ];

  const contractColumns = [
    { key: 'Custom ID', header: 'Custom ID' },
    { key: 'Project Name', header: 'Project Name' },
    { key: 'Unit', header: 'Unit' },
    { key: 'Location', header: 'Location' },
    { key: 'Program', header: 'Program' },
    { key: 'Audit Type', header: 'Audit Type' },
    { key: 'Auditor ID', header: 'Auditor ID' },
    { key: 'Auditor Name', header: 'Auditor Name' },
    { key: 'Contract Date', header: 'Contract Date' },
    { key: 'Start Date', header: 'Start Date' },
    { key: 'End Date', header: 'End Date' },
    { key: 'Duration', header: 'Duration' },
    { key: 'Offer Days', header: 'Offer Days' },
    { key: 'Man Day Cost', header: 'Man Day Cost' },
    { key: 'Total Cost ($)', header: 'Total Cost ($)' },
    { key: 'Total Cost (LKR)', header: 'Total Cost (LKR)' },
    { key: 'Status', header: 'Status' }
  ];

  const handleExport = (exportType, documentType) => {
    // Filter contracts based on selected document type
    const filteredContracts = contracts.filter(contract => {
      if (documentType === 'approved') return contract.status === 'Approved';
      if (documentType === 'pending') return contract.status === 'Pending';
      if (documentType === 'rejected') return contract.status === 'Rejected';
      return false;
    });

    // Format the data for export
    const exportData = filteredContracts.map(contract => ({
      'Custom ID': contract.customId,
      'Project Name': contract.projectName,
      'Unit': contract.unit,
      'Location': contract.location,
      'Program': contract.program,
      'Audit Type': contract.auditType,
      'Auditor ID': contract.auditorId,
      'Auditor Name': contract.auditorName,
      'Contract Date': new Date(contract.contractDate).toLocaleDateString(),
      'Start Date': new Date(contract.auditStartDate).toLocaleDateString(),
      'End Date': new Date(contract.auditEndDate).toLocaleDateString(),
      'Duration': contract.auditDuration,
      'Offer Days': contract.offerDays,
      'Man Day Cost': `$${contract.manDayCost}`,
      'Total Cost ($)': `$${contract.totalCost}`,
      'Total Cost (LKR)': `LKR ${contract.totalCostLKR}`,
      'Status': contract.status
    }));

    const fileName = `${documentType}_contracts_${new Date().toISOString().split('T')[0]}`;

    if (exportType === 'excel') {
      exportToExcel(exportData, fileName);
    } else {
      exportToPDF(exportData, fileName, contractColumns);
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* NavBar */}
      <NavBar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 p-6 ${isSidebarVisible ? "ml-64" : "ml-0"}`}>
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
          {/* Total Contracts Created */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Total Contracts Created
            </h3>
            <p className="text-4xl font-bold text-center text-blue-500">
              {contracts.length}
            </p>
          </div>

          {/* Remaining Contracts */}
          <div 
            onClick={() => navigate('/PendingContracts')}
            className="bg-gray-700 p-6 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold mb-2 text-center">
              Remaining Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-orange-500">
              {pendingAudits.length}
            </p>
          </div>

          {/* Approved Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Approved Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-green-500">
              {contracts.filter(contract => contract.status === "Approved").length}
            </p>
          </div>

          {/* Rejected Contracts */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Rejected Contracts
            </h3>
            <p className="text-4xl font-bold text-center text-red-500">
              {contracts.filter(contract => contract.status === "Rejected").length}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 
        bg-clip-text text-transparent mb-3 mt-6 text-center">Created Contracts
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
            <label className="text-sm text-gray-400 mb-1">Contract Date</label>
            <input
              type="text"
              placeholder="Filter Contract Date"
              value={filters.contractDate}
              onChange={(e) => handleFilterChange('contractDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Start Date</label>
            <input
              type="text"
              placeholder="Filter Start Date"
              value={filters.auditStartDate}
              onChange={(e) => handleFilterChange('auditStartDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">End Date</label>
            <input
              type="text"
              placeholder="Filter End Date"
              value={filters.auditEndDate}
              onChange={(e) => handleFilterChange('auditEndDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Duration (days)</label>
            <input
              type="text"
              placeholder="Filter Duration"
              value={filters.auditDuration}
              onChange={(e) => handleFilterChange('auditDuration', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Offer Days</label>
            <input
              type="text"
              placeholder="Filter Offer Days"
              value={filters.offerDays}
              onChange={(e) => handleFilterChange('offerDays', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Man Cost</label>
            <input
              type="text"
              placeholder="Filter Man Cost"
              value={filters.manDayCost}
              onChange={(e) => handleFilterChange('manDayCost', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Total Cost ($)</label>
            <input
              type="text"
              placeholder="Filter Total Cost ($)"
              value={filters.totalCost}
              onChange={(e) => handleFilterChange('totalCost', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-1">Total Cost (LKR)</label>
            <input
              type="text"
              placeholder="Filter Total Cost (LKR)"
              value={filters.totalCostLKR}
              onChange={(e) => handleFilterChange('totalCostLKR', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <div className="overflow-x-auto" style={{ maxWidth: '100%' }}>
            <div className="inline-block min-w-full align-middle">
              {error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
              ) : contracts.length === 0 ? (
                <div className="text-gray-400 text-center p-4">No contracts found. Create a contract to see it here.</div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full table-fixed divide-y divide-gray-600 bg-gray-700">
                    <thead className="bg-gray-700">
                      <tr>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Custom ID
                        </th>
                        <th scope="col" className="w-48 px-4 py-3 text-center text-sm font-semibold text-white">
                          Project Name
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Unit
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Location
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Program
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Audit Type
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Auditor ID
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Auditor Name
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Contract Date
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Start Date
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          End Date
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Duration
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Offer Days
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Man Day Cost
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Total Cost ($)
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Total Cost (LKR)
                        </th>
                        <th scope="col" className="w-32 px-4 py-3 text-center text-sm font-semibold text-white">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                      {filteredContracts.map((contract) => (
                        <tr key={contract._id} className="hover:bg-gray-600">
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.customId}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.projectName}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.unit}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.location}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.program}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.auditType}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.auditorId}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.auditorName}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">
                            {new Date(contract.contractDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-white">
                            {new Date(contract.auditStartDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-white">
                            {new Date(contract.auditEndDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.auditDuration}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">{contract.offerDays}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">${contract.manDayCost}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">${contract.totalCost}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">LKR {contract.totalCostLKR}</td>
                          <td className="px-4 py-3 text-center text-sm text-white">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              contract.status === 'Approved' ? 'bg-green-500' :
                              contract.status === 'Rejected' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}>
                              {contract.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExport}
          documentTypes={documentTypes}
          title="Export Created Contracts"
        />
      </div>
    </div>
  );
};

export default ContractStatus;
