import axios from "axios";
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { getUSDToLKRRate } from '../../../utils/currencyConverter';

const ContractCreation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  
  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    customId: "",
    projectName: "",
    unit: "",
    location: "",
    program: "",
    auditType: "",
    auditorId: "",
    auditorName: "",
    contractDate: "",
    auditStartDate: "",
    auditEndDate: "",
    offerDays: "",
    manDayCost: "",
    status: ""
  });

  const [calculatedData, setCalculatedData] = useState({
    auditDuration: 0,
    totalCost: 0,
    totalCostLKR: 0, // Add totalCostLKR for the LKR conversion
  });

  const [exchangeRate, setExchangeRate] = useState(300); // Default fallback rate

  // Initialize form with data from PendingContracts if available
  useEffect(() => {
    if (location.state) {
      console.log("Received data in ContractCreation:", location.state);
      const customId = location.state.customId || generateCustomId();
      
      const formDataUpdate = {
        customId: customId,
        projectName: location.state.projectName,
        unit: location.state.unit,
        location: location.state.location,
        program: location.state.program,
        auditType: location.state.auditType,
        auditorId: location.state.auditorId,
        auditorName: location.state.auditorName,
        auditStartDate: formatDate(location.state.startDate),
        auditEndDate: formatDate(location.state.endDate),
        contractDate: formatDate(new Date()),
        status: "Pending"
      };

      console.log("Setting form data in ContractCreation:", formDataUpdate);
      setFormData(prev => ({
        ...prev,
        ...formDataUpdate
      }));
    }
  }, [location.state]);

  // Function to generate a custom ID
  const generateCustomId = () => {
    const prefix = "PR";
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit number
    return `${prefix}${randomNum}`;
  };

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  useEffect(() => {
    // Fetch current exchange rate when component mounts
    const fetchExchangeRate = async () => {
      const rate = await getUSDToLKRRate();
      setExchangeRate(rate);
    };
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    calculateValues(formData);
  }, [formData, exchangeRate]); // Add exchangeRate as dependency

  const calculateValues = (data) => {
    const start = new Date(data.auditStartDate);
    const end = new Date(data.auditEndDate);
    const duration = (end - start) / (1000 * 60 * 60 * 24) + 1;
    
    // Total cost should be the man day cost (per day rate)
    const totalCost = Number(data.manDayCost) || 0;

    // Use current exchange rate for LKR conversion
    const totalCostLKR = totalCost * exchangeRate;

    setCalculatedData({
      auditDuration: duration > 0 ? duration : 0,
      totalCost: totalCost,
      totalCostLKR: totalCostLKR || 0,
    });
  };

  // Validations
  
  const validateForm = () => {
    // Check for empty fields
    const requiredFields = [
      'customId', 'projectName', 'unit', 'location', 'program',
      'auditType', 'auditorId', 'auditorName', 'contractDate',
      'auditStartDate', 'auditEndDate', 'offerDays', 'manDayCost'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === "") {
        console.error(`Validation failed: ${field} is empty`);
        alert(`${field} cannot be empty`);
        return false;
      }
    }

    // Offer Days positive whole number check
    if (!Number.isInteger(Number(formData.offerDays)) || Number(formData.offerDays) <= 0) {
      alert("Offer Days must be a positive whole number");
      return false;
    }

    // Man Day Cost positive number check
    if (parseInt(formData.manDayCost) <= 0) {
      alert("Man Day Cost must be a positive number");
      return false;
    }

    // Check if Offer Days is greater than Audit Duration
    if (Number(formData.offerDays) <= calculatedData.auditDuration) {
      alert("Offer Days must be greater than Audit Duration");
      return false;
    }

    console.log("Form validation passed");
    return true; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Current form data:", formData);

      // Create the payload
      const payload = {
        customId: formData.customId,
        projectName: formData.projectName,
        unit: formData.unit,
        location: formData.location,
        program: formData.program,
        auditType: formData.auditType,
        auditorId: formData.auditorId,
        auditorName: formData.auditorName,
        contractDate: new Date(formData.contractDate),
        auditStartDate: new Date(formData.auditStartDate),
        auditEndDate: new Date(formData.auditEndDate),
        offerDays: Number(formData.offerDays),
        manDayCost: Number(formData.manDayCost),
        status: "Pending",
        exchangeRate: exchangeRate, // Save the current exchange rate
        totalCost: calculatedData.totalCost,
        totalCostLKR: calculatedData.totalCostLKR
      };

      console.log("Sending payload to server:", payload);

      // Create the contract
      const response = await axios.post("http://localhost:5005/api/contractor/createcontract", payload);
      console.log("Server response:", response.data);

      if (!response.data) {
        throw new Error("No data received from server");
      }

      // Verify the saved data
      console.log("Saved contract data:", response.data);

      alert("Contract created successfully!");
      navigate('/ContractStatus');
      
    } catch (err) {
      console.error("Error creating contract:", err);
      console.error("Error details:", err.response?.data || err.message);
      alert("Error creating contract: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="flex">
      {/* Sidebar - fixed to the left */}
      {isSidebarVisible && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-900 z-20">
          <SideBar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main Content Section */}
      <div className="flex-1 bg-gray-800 min-h-screen text-black relative">
        {/* NavBar stays fixed at top */}
        <NavBar toggleSidebar={toggleSidebar} />
        <div className={`transition-all duration-300 p-8 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8 text-center">
            Create New Contract
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Audit Information Section */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-400 mb-6">Audit Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Custom ID</label>
                    <input
                      type="text"
                      name="customId"
                      value={formData.customId}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Project Name</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Unit</label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Program</label>
                    <input
                      type="text"
                      name="program"
                      value={formData.program}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Audit Type</label>
                    <input
                      type="text"
                      name="auditType"
                      value={formData.auditType}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Auditor ID</label>
                    <input
                      type="text"
                      name="auditorId"
                      value={formData.auditorId}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Auditor Name</label>
                    <input
                      type="text"
                      name="auditorName"
                      value={formData.auditorName}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Status and Dates Section */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-400 mb-6">Status and Dates</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Status</label>
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Start Date</label>
                    <input
                      type="text"
                      name="auditStartDate"
                      value={formatDate(formData.auditStartDate)}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">End Date</label>
                    <input
                      type="text"
                      name="auditEndDate"
                      value={formatDate(formData.auditEndDate)}
                      readOnly
                      className="w-full p-3 border rounded-lg bg-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Contract Date</label>
                    <input
                      type="date"
                      name="contractDate"
                      value={formData.contractDate}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Summary Cards Section */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-purple-400 text-lg font-semibold mb-2">Audit Duration</h3>
                  <p className="text-white text-2xl font-bold">{calculatedData.auditDuration} days</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-yellow-400 text-lg font-semibold mb-2">Total Cost ($)</h3>
                  <p className="text-white text-2xl font-bold">${calculatedData.totalCost.toFixed(2)}</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-yellow-400 text-lg font-semibold mb-2">Total Cost (LKR)</h3>
                  <p className="text-white text-2xl font-bold">LKR {calculatedData.totalCostLKR.toFixed(2)}</p>
                </div>
              </div>

              {/* Contract Details Section */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-400 mb-6">Contract Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Offer Days</label>
                    <input
                      type="number"
                      name="offerDays"
                      value={formData.offerDays}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-gray-300">Man Day Cost ($)</label>
                    <input
                      type="number"
                      name="manDayCost"
                      value={formData.manDayCost}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                >
                  Create Contract
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractCreation;
