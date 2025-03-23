import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';

const UpdateContract = () => {
  const { id } = useParams(); // Extract contract ID from URL
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
     
       // Toggle Sidebar
       const toggleSidebar = () => {
         setIsSidebarVisible((prev) => !prev);
       };
  

  const [contractData, setContractData] = useState({
    projectID: "",
    projectName: "",
    clientID: "",
    clientName: "",
    contractDate: "",
    auditStartDate: "",
    auditEndDate: "",
    auditDuration: 0,
    offerDays: 0,
    manDayCost: 0,
    totalCost: 0,
    totalCostLKR: 0,
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/api/contractor/readSingleContract/${id}`);
        const data = response.data;

        setContractData({
          projectID: data.projectID,
          projectName: data.projectName,
          clientID: data.clientID,
          clientName: data.clientName,
          contractDate: data.contractDate.split("T")[0],
          auditStartDate: data.auditStartDate.split("T")[0],
          auditEndDate: data.auditEndDate.split("T")[0],
          auditDuration: data.auditDuration,
          offerDays: data.offerDays,
          manDayCost: data.manDayCost,
          totalCost: data.totalCost,
          totalCostLKR: data.totalCostLKR,
        });
      } catch (err) {
        setError("Failed to fetch contract data.");
      }
    };

    fetchContract();
  }, [id]);

  // Function to calculate audit duration and total cost
  const calculateValues = (data) => {
    const start = new Date(data.auditStartDate);
    const end = new Date(data.auditEndDate);

    const duration = (end - start) / (1000 * 60 * 60 * 24) + 1;
    const totalCost = data.offerDays * data.manDayCost;

     // Set calculated values
     const conversionRate = 300; // Example: 1 GBP = 300 LKR
     const totalCostLKR = totalCost * conversionRate; // Convert to LKR
     
    setContractData({
      ...data,
      auditDuration: duration > 0 ? duration : 0,
      totalCost: totalCost || 0,
      totalCostLKR: totalCostLKR || 0, // Store the converted LKR value
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...contractData,
      [name]: value,
    };

    setContractData(updatedData);

    // Recalculate if related fields change
    if (
      name === "auditStartDate" ||
      name === "auditEndDate" ||
      name === "offerDays" ||
      name === "manDayCost"
    ) {
      calculateValues(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Call validateForm before proceeding
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }
  
    try {
      await axios.put(`http://localhost:5005/api/contractor/updateContract/${id}`, contractData);
      alert("Contract updated successfully!");
      navigate("/contractStatus");
    } catch (err) {
      setError("Failed to update contract. Please try again.");
    }
  };
  
  const validateForm = () => {
    // Check for empty fields
    for (let key in contractData) {
      if (contractData[key] === "") {
        alert(`${key} cannot be empty`);
        return false;
      }
    }
  
    // Date Validation
    const start = new Date(contractData.auditStartDate);
    const end = new Date(contractData.auditEndDate);
    if (start > end) {
      alert("Audit Start Date cannot be after Audit End Date");
      return false;
    }
  
    // Offer Days positive whole number check
    if (!Number.isInteger(Number(contractData.offerDays)) || Number(contractData.offerDays) <= 0) {
      alert("Offer Days must be a positive whole number");
      return false;
    }
  
    // Man Day Cost positive number check
    if (parseInt(contractData.manDayCost) <= 0) {
      alert("Man Day Cost must be a positive number");
      return false;
    }
  
    // Contract date should not be a future date
    const today = new Date();
    const contractDate = new Date(contractData.contractDate);
    if (contractDate > today) {
      alert("Contract Date cannot be in the future");
      return false;
    }
  
    // ID Validation
    const idPattern = /^[A-Z]{2}\d{4,}$/; 
    if (!idPattern.test(contractData.projectID)) {
      alert("Project ID format invalid. Example: PR1234");
      return false;
    }
  
    if (!idPattern.test(contractData.clientID)) {
      alert("Client ID format invalid. Example: CL4567");
      return false;
    }
  
    // Name Validation
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(contractData.clientName) || !namePattern.test(contractData.projectName)) {
      alert("Client Name and Project Name should only contain letters and spaces.");
      return false;
    }
  
    return true; 
  };
  

  // Handle contract deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contract?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5005/api/contractor/deleteContract/${id}`);
        alert("Contract deleted successfully!");
        navigate("/contractStatus");
      } catch (err) {
        setError("Failed to delete contract. Please try again.");
      }
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
        <div
        className={`transition-all duration-300 p-6 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}
        >
          <div className="max-w-xl mx-auto mt-10 p-6 shadow-lg rounded-2xl bg-gray-700">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500
             bg-clip-text text-transparent mb-4 text-center">Update Contract</h2>
       

      <form onSubmit={handleSubmit} className="space-y-4 h-[500px] overflow-y-auto relative pr-4">
        {/* Project ID */}
        <div>
          <label className="block mb-1 font-semibold text-white">Project ID</label>
          <input
            type="text"
            name="projectID"
            value={contractData.projectID}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            readOnly
          />
        </div>

        {/* Project Name */}
        <div>
          <label className="block mb-1 font-semibold text-white">Project Name</label>
          <input
            type="text"
            name="projectName"
            value={contractData.projectName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Client ID */}
        <div>
          <label className="block mb-1 font-semibold text-white">Client ID</label>
          <input
            type="text"
            name="clientID"
            value={contractData.clientID}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Client Name */}
        <div>
          <label className="block mb-1 font-semibold text-white">Client Name</label>
          <input
            type="text"
            name="clientName"
            value={contractData.clientName}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Contract Date */}
        <div>
          <label className="block mb-1 font-semibold text-white">Contract Date</label>
          <input
            type="date"
            name="contractDate"
            value={contractData.contractDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Audit Start Date */}
        <div>
          <label className="block mb-1 font-semibold text-white">Audit Start Date</label>
          <input
            type="date"
            name="auditStartDate"
            value={contractData.auditStartDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Audit End Date */}
        <div>
          <label className="block mb-1 font-semibold text-white">Audit End Date</label>
          <input
            type="date"
            name="auditEndDate"
            value={contractData.auditEndDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Offer Days */}
        <div>
          <label className="block mb-1 font-semibold text-white">Offer Days</label>
          <input
            type="number"
            name="offerDays"
            value={contractData.offerDays}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Man Day Cost */}
        <div>
          <label className="block mb-1 font-semibold text-white">Man Day Cost</label>
          <input
            type="number"
            name="manDayCost"
            value={contractData.manDayCost}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        {/* Calculated Fields */}
        <div className="bg-gray-100 p-3 rounded-lg mt-4">
          <p className="font-semibold">Audit Duration: {contractData.auditDuration} days</p>
          <p className="font-semibold">Total Cost (£): {contractData.totalCost}</p>
          <p className="font-semibold">Total Cost (LKR): {contractData.totalCostLKR}</p>
        </div>
        <div className="sticky bottom-0 bg-gray-700 flex pt-2 pb-0 justify-center">

        <button type="submit" className="w-1/3 mr-2 ml-2 mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-blue-600">
          Update Contract
        </button>
        
        <button
          type="button"
          onClick={handleDelete}
          className="w-1/3 mr-2 ml-2 mt-4 mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-blue-600"
        >
          Delete Contract
        </button>
        </div>
      </form>
      </div>
      </div>
      </div>
    </div>
  );
};

export default UpdateContract;
