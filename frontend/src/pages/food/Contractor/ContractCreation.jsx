import axios from "axios";
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';
import React, { useState, useEffect } from "react";


const ContractCreation = () => {

   const [isSidebarVisible, setIsSidebarVisible] = useState(false);
   
     // Toggle Sidebar
     const toggleSidebar = () => {
       setIsSidebarVisible((prev) => !prev);
     };

  const [formData, setFormData] = useState({
    phoneNumber: "",
    projectID: "",
    projectName: "",
    clientID: "",
    clientName: "",
    contractDate: "",
    auditStartDate: "",
    auditEndDate: "",
    offerDays: "",
    manDayCost: "",
    
  });

  const [calculatedData, setCalculatedData] = useState({
    auditDuration: 0,
    totalCost: 0,
    totalCostLKR: 0, // Add totalCostLKR for the LKR conversion
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  useEffect(() => {
    calculateValues(formData);
  }, [formData]);
  

  const calculateValues = (data) => {
    const start = new Date(data.auditStartDate);
    const end = new Date(data.auditEndDate);
    const duration = (end - start) / (1000 * 60 * 60 * 24) + 1;
    const totalCost = data.offerDays * data.manDayCost;

    // Set calculated values
    const conversionRate = 300; // Example: 1 GBP = 300 LKR
    const totalCostLKR = totalCost * conversionRate; // Convert to LKR

    setCalculatedData({
      auditDuration: duration > 0 ? duration : 0,
      totalCost: totalCost || 0,
      totalCostLKR: totalCostLKR || 0, // Store the converted LKR value
    });
  };

  // Validations
  
  const validateForm = () => {
    // Check for empty fields
    for (let key in formData) {
      if (formData[key] === "") {
        alert(`${key} cannot be empty`);
        return false;
      }
    }

    // Date Validation
    const start = new Date(formData.auditStartDate);
    const end = new Date(formData.auditEndDate);
    if (start > end) {
      alert("Audit Start Date cannot be after Audit End Date");
      return false;
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

    // Contract date should not be a future date
    const today = new Date();
    const contractDate = new Date(formData.contractDate);
    if (contractDate > today) {
      alert("Contract Date cannot be in the future");
      return false;
    }

    // ID Validation
    const idPattern = /^[A-Z]{2}\d{4,}$/; 
    if (!idPattern.test(formData.projectID)) {
    alert("Project ID format invalid. Example: PR1234");
    return;
    }

    if (!idPattern.test(formData.clientID)) {
      alert("Client ID format invalid. Example: CL4567");
      return;
    }

    // Name Validation
    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(formData.clientName) || !namePattern.test(formData.projectName)) {
      alert("Client Name and Project Name should only contain letters and spaces.");
      return;
    }

    return true; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        auditDuration: calculatedData.auditDuration,
        totalCost: calculatedData.totalCost,
        totalCostLKR: calculatedData.totalCostLKR,
      };

      await axios.post("http://localhost:5005/api/contractor/createContract", payload);

      alert("Contract created successfully!");
      setFormData({
        phoneNumber: "",
        projectID: "",
        projectName: "",
        clientID: "",
        clientName: "",
        contractDate: "",
        auditStartDate: "",
        auditEndDate: "",
        offerDays: "",
        manDayCost: "",
       

      });
      setCalculatedData({
        auditDuration: 0,
        totalCost: 0,
        totalCostLKR: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Error creating contract");
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
             bg-clip-text text-transparent mb-4 text-center">Create New Contract</h2>

            <form onSubmit={handleSubmit} className="space-y-4 h-[500px] overflow-y-auto relative pr-4">
              {/* Form Fields */}
              <div>
                {/* new */}

              <div>
                <label className="block mb-1 font-semibold text-white">Phone Number</label>
                <input
                  type="String"
                  name="phoneNumber"
                  value={formData.new}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
                <label className="block mb-1 font-semibold text-white">Project ID</label>
                <input
                  type="text"
                  name="projectID"
                  value={formData.projectID}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Project Name</label>
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Client ID</label>
                <input
                  type="text"
                  name="clientID"
                  value={formData.clientID}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Client Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Contract Date</label>
                <input
                  type="date"
                  name="contractDate"
                  value={formData.contractDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Audit Start Date</label>
                <input
                  type="date"
                  name="auditStartDate"
                  value={formData.auditStartDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Audit End Date</label>
                <input
                  type="date"
                  name="auditEndDate"
                  value={formData.auditEndDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Offer Days</label>
                <input
                  type="number"
                  name="offerDays"
                  value={formData.offerDays}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-white">Man Day Cost</label>
                <input
                  type="number"
                  name="manDayCost"
                  value={formData.manDayCost}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg"
                />
              </div>


              



              {/* Calculated Fields */}
              <div className="bg-gray-100 p-3 rounded-lg mt-4">
                <p className="font-semibold">Audit Duration: {calculatedData.auditDuration} days</p>
                <p className="font-semibold">Total Cost ($): {calculatedData.totalCost}</p>
                <p className="font-semibold">Total Cost (LKR): {calculatedData.totalCostLKR}</p>
              </div>

              {/* Submit Button */}
              <div className="sticky bottom-0 bg-gray-700 pt-2 pb-0">
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                  Submit Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractCreation;
