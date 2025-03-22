import React, { useState } from "react";

const AuditReportForm = () => {
  
  const [step, setStep] = useState(1);
  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  }
  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const [errors, setErrors] = useState({});


  const validateForm = () => {
    let newErrors = {};
    
    // Required fields validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Zip code validation (Optional: Customize based on country)
    if (formData.zip && !/^\d{4,6}$/.test(formData.zip)) {
      newErrors.zip = "Zip code must be 4-6 digits";
    }

    // Mobile number validation
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be 10 digits";
    }



    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      alert("Form submitted successfully! 🚀");
      setStep(3); // Move to next step (if required)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [formData, setFormData] = useState({
    // Employee Details
    unitName: "",
    totalMale: "",
    totalFemale: "",
    groupInterviewed: "",
    individualInterviewed: "",
  
    // Sample Collection
    sampleCollected: "",
    sampleReason: "",
  
    // Summary of Evidence
    evidenceNumber: "",
    documentTitle: "",
    documentDate: "",
    evidenceDescription: "",
  
    // Dyes & Chemicals
    dyesChemicals: "",
    dyesDescription: "",
  
    // Audit Details
    auditType: "on-site",
    auditor1: "",
    auditor2: "",
    startDate: "",
    endDate: "",
    inspection: "",
    organizationNumber: "",
  
    // Additional Fields
    companyName: "",
    address: "",
    zip: "",
    country: "",
    city: "",
    email: "",
    mobile: "",
  
    // Unit Assessed
    unitAddress: "",
    unitCity: "",
    unitCountry: "",
  
    // General Questions
    totalPurchased: "",
    totalProduced: "",
    processLoss: "",
    totalSold: "",
    totalStock: "",
    remarks: "",
  });


  return (

    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Audit Report</h1>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Client Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Main Client Information</h2>
              <div className="space-y-3">
              {[
                { name: "companyName", label: "Company Name" },
                { name: "address", label: "Address" },
                { name: "zip", label: "Zip" },
                { name: "country", label: "Country" },
                { name: "city", label: "City" },
                { name: "email", label: "Email" },
                { name: "mobile", label: "Mobile" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm mb-1">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"
                  />
                    {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                      )}
                </div>
              ))}
              </div>
            </div>

            {/* Unit Assessed */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Unit Assessed</h2>
              <div className="space-y-4">
              {[
                    { name: "unitName", label: "Unit Name" },
                    { name: "unitAddress", label: "Address" },
                    { name: "unitCity", label: "City" },
                    { name: "unitCountry", label: "Country" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm mb-1">{field.label}</label>
                      <input
                        type="text"
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"
                      />
                      {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* General Questions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">General Questions</h2>
              <h3 className="text-lg font-semibold mb-2">Annual Mass Balance</h3>
              <div className="space-y-4">
              {[
                    { name: "totalPurchased", label: "Total Certified Material Purchased (in Kgs)" },
                    { name: "totalProduced", label: "Total Certified Product Produced (in Kgs)" },
                    { name: "processLoss", label: "Process Loss (in Kgs)" },
                    { name: "totalSold", label: "Total Certified Material Sold (in Kgs)" },
                    { name: "totalStock", label: "Total Certified Material in Stock (in Kgs)" },
                    { name: "remarks", label: "Remarks" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm mb-1">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600"
                      />
                      {errors[field.name] && (
                        <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Employee details of unit(s)</h2>
              <div className="space-y-4">
                <label className="block text-sm mb-1">Unit Name</label>
                <input type="text" name="unitName" value={formData.unitName} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                <label className="block text-sm mb-2">Total Employee</label>
                <div className="flex space-x-4">
                  <label className="text-sm mb-1">Male</label>
                  <input type="number" name="totalMale" value={formData.totalMale} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                  <label className="text-sm mb-1">Female</label>
                  <input type="text" name="totalFemale" value={formData.totalFemale} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
                <label className="block text-sm mb-2">Interviewed</label>
                <div className="flex space-x-4">
                  <label className="block text-sm mb-1">Group</label>
                  <input type="text" name="groupInterviewed" value={formData.groupInterviewed} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                  <label className="block text-sm mb-1">Individual</label>
                  <input type="text" name=" individualInterviewed" value={formData.individualInterviewed} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Sample Collected for Testing</h2>
                <label className="block text-sm mb-1">Sample Collected</label>
                <div className="flex items-center space-x-4">
                      <label className="text-white">Yes</label>
                              <input 
                                type="radio" 
                                name="answer" 
                                value="yes" 
                                className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700" 
                                />
                      <label className="text-white">No</label>
                              <input 
                                type="radio" 
                                name="answer" 
                                value="no" 
                                className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700" 
                                />
                  </div>
                <label className="block text-sm mb-1">Reason </label>
                <input type="text" name="sampleReason"  value={formData.sampleReason} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Summary of Evidence</h2>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <label className="text-sm mb-1">Number</label>
                  <input type="text" name="documentNumber" value={formData.evidenceNumber} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                  <label className="text-sm mb-1">Document Title</label>
                  <input type="text" name="documentTitle" value={formData.documentTitle} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
                  <label className="text-sm mb-1">Document Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" 
                    name=""
                    onChange={handleChange}
                    />
                    <label className="text-sm mb-1">Description</label>
                    <input type="text" name="evidenceDescription" value = {formData.evidenceDescription} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                    <h2 className="text-xl font-semibold mt-3 mb-4">Summary for Dyes and chemicals</h2>
                    <label className="text-sm mb-1">Dyes/Chemical names</label>
                    <input type="text" name="dyesChemicals" value={formData.dyesChemicals} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                    <label className="text-sm mb-1">Description</label>
                    <input type="text" name="dyesDescription" value={formData.dyesChemicals} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
                    
              </div>
            </div>
            
            <div>
            <h2 className="text-xl font-semibold mb-4">Audit Details</h2>
            <div className="space-y-4">

            </div>
            <label className="text-sm mb-1">Audit Type</label>
            <select className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white">
              <option value="on-site">On-site</option>
              <option value="online">Online</option>
            </select>
            <label className="text-sm mb-1">Auditors</label>
            <div className="space-y-4">
              <input type="text" name="auditor1" value={formData.auditor1} onChange={handleChange} placeholder="auditor 1" className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
              <input type="text" name="auditor2" value={formData.auditor2} onChange={handleChange} placeholder="auditor 2" className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
           </div>
           <h2 className="text-xl font-semibold mt-4 mb-2">Audit</h2>
            <div className="flex space-x-4">
              <div className="w-full">
                
                <label className="text-sm mb-1">Start Date</label>
                <input type="date" name="startDate" onChange={handleChange} value={formData.startDate} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
              </div>
              <div className="w-full">
                <label className="text-sm mb-4">End Date</label>
                <input type="date"  name="endDate" onChange={handleChange} value={formData.endDate} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 text-white" />
              </div>
            </div>
            <label className="text-sm mt-2">Inspection</label>
            <input type="text" name="inspection" value={formData.inspection} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
            <label className="text-sm mt-2">Oranization Number(PRJ)</label>
            <input type="text" name="organizationNumber" value={formData.organizationNumber} onChange={handleChange} className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700" />
            </div>
        
            </div> 
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-2 space-x-4 ">
          {step > 1 && (
            <button onClick={prevStep} className="btn btn-outline btn-accent">
              Previous
            </button>
          )}

          {step < 2 && (
            <button onClick={nextStep} className="btn btn-outline btn-accent  mt-0 ">
              Next
            </button>
           )}
            {step === 2 && <button  className="btn btn-outline btn-accent"  type="submit">Submit</button>}
        </div>
        </form>
      </div>
    </div>
  );
};

export default AuditReportForm;
