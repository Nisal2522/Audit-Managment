import React, { useState, useEffect } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";
  import { createEmployee } from "../../../services/employeeservice";

const CreateprofileFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    dob: "",
    employeeId: " ",
    profilePicture: null,
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [qualifiedPrograms, setQualifiedPrograms] = useState({
    GOTS: false,
    GRS: false,
    OCS: false,
    RCS: false,
    SRCCS: false,
    REGENAGRI: false,
    "BCI Cotton": false,
    PPRS: false,
  });


  // Function to generate random Employee ID
  const generateEmployeeId = () => {
    const prefix = "AFD"; // Food department prefix
    const randomNum = Math.floor(Math.random() * 10000) + 1000; // Generates a number between 1000 and 19999
    return `${prefix}${randomNum}`;
  };

   // Function to generate random Password (based on the user's name)
   const generatePassword = (name) => {
    const namePart = name.replace(/\s+/g, '').slice(2, 6).toLowerCase(); // Remove spaces and use first 3 characters
    const randomNum = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999
    const specialChars = "!@#$%^&*";
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    const password = `${namePart}${randomNum}${randomSpecialChar}`;
    return password;
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword(formData.name); // Generate new password based on current name
    setFormData((prev) => ({ ...prev, password: newPassword })); // Update password in the formData
  };
  
  
  
  const [expandedProgram, setExpandedProgram] = useState(null);

  // Handle Checkbox Change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
  
    setQualifiedPrograms((prev) => ({
      ...prev,
      [name]: checked ? { startDate: "", expireDate: "" } : undefined,
    }));
  
    // Set the expanded program to the current one if checked, otherwise reset
    setExpandedProgram(checked ? name : null);
  };
  

  

  const handleDateChange = (e, program) => {
    const { value } = e.target;
  
    setQualifiedPrograms((prev) => {
      const startDate = new Date(value);
      startDate.setFullYear(startDate.getFullYear() + 1); // Add one year
      const expireDate = startDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  
      return {
        ...prev,
        [program]: { startDate: value, expireDate: expireDate },
      };
    });
  };
  
  
  

  

  // Apply Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);


  useEffect(() => {
    const employeeId = generateEmployeeId(); // Generate a new ID on mount
    const password = generatePassword(formData.name); // Generate password based on name
    setFormData((prev) => ({ ...prev, employeeId, password })); // Set password only once
  }, []); // This effect should run only once when the component mounts

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };


  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if all form fields are filled
    const isFormComplete = Object.values(formData).every((value) => value !== "");
  
    // Convert `qualifiedPrograms` from an object to an array
    const formattedPrograms = Object.entries(qualifiedPrograms)
      .filter(([_, program]) => program) // Keep only selected programs
      .map(([name, program]) => ({
        name,
        startDate: program.startDate || "", // Ensure date exists
        expireDate: program.expireDate || "", // Ensure date exists
      }));
  
    // Check if at least one Qualified Program is selected
    if (formattedPrograms.length === 0) {
      alert("Please select at least one Qualified Program before submitting.");
      return;
    }
  
    // Check if all selected programs have Start Dates
    const isDateProvided = formattedPrograms.every((program) => program.startDate);
    if (!isDateProvided) {
      alert("Please provide a Start Date for the selected program(s) before submitting.");
      return;
    }
  
    if (!isFormComplete) {
      alert("Please fill in all fields before submitting.");
      return;
    }
  
    try {
      // Send data to backend, ensuring qualifiedPrograms is an array
      await createEmployee({ 
        ...formData, 
        qualifiedPrograms: formattedPrograms, 
        employeeId: formData.employeeId 
      });
  
      alert("Account Created Successfully!");
  
      // Reset form after submission
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        phone: "",
        address: "",
        dob: "",
        employeeId: "",
      });
  
      setQualifiedPrograms({}); // Reset selected programs
  
    } catch (error) {
      alert("Error creating account. Please try again.");
    }
  };
  

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col`}>
      {/* Header */}
      <Navbar />

     {/* Dark Mode Button */}
            <div className="absolute top-[19%] right-8 transform -translate-y-1/2">
            <button
                    onClick={handleToggleDarkMode}
                    className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
                  >
                    {darkMode ? "☀️" : "🌙"}
              </button>
            </div>



      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Section */}
        <main className="flex-grow flex items-center justify-center p-6">
          {/* Card Container */}
          <div className={`shadow-lg rounded-xl p-8 w-full max-w-3xl transition duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            
            {/* Label with Dynamic Text Color */}
            <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'} shadow-lg`}>
              Create Account 
            </label>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                        ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                      `}
                      required
                    />
                  </div>



                {/* Email */}
                <div>
                  <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}                    required
                  />
                </div>
              </div>

              {/* Password (Automatically generated) */}
              <div className="mb-4 relative">
                      <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Password
                      </label>
                      <input
                        type="text"
                        id="password"
                        name="password"
                        value={formData.password}
                        readOnly
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                          ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                        `}
                      />
              </div>

               {/* Button to regenerate password */}
                    <div className="mb-4 flex justify-end">
                      <button
                        type="button"
                        onClick={handleRegeneratePassword}
                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        Regenerate Password
                      </button>
                    </div>


              {/* Employee ID */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}                  readOnly
                />
              </div>

              {/* Role */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}                  required
                >
                  <option value="">Select Role</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Planner">Planner</option>
                  <option value="Reviwer">Reviewer</option>
                  <option value="creator">Project Creator</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>

              {/* Phone & DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}                    required
                  />
                </div>

                <div>
                  <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}                  rows="2"
                  required
                ></textarea>
              </div>

              {/* Qualified Programs Section */}
{/* Qualified Programs Section */}
{/* Qualified Programs Section */}




<div>
  <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
    Qualified Programs
  </label>
  <div className="grid grid-cols-2 gap-3 text-black font-bold">
    {["GOTS", "GRS", "OCS", "RCS", "SRCCS", "REGENAGRI", "BCI Cotton", "PPRS"].map(
      (program) => (
        <div
          key={program}
          className={`flex flex-col border p-3 rounded-md shadow-sm bg-gray-50 transition-all duration-300 ${
            expandedProgram === program ? "flex-col-reverse" : "flex-col"
          }`}
        >
          {/* Show Date Inputs above Checkbox when checked */}
          {qualifiedPrograms[program] && (
            <div className="flex flex-col gap-2 mb-2 mt-8">
              <label className="text-sm">Start Date</label>
              <input
                type="date"
                value={qualifiedPrograms[program]?.startDate || ""}
                onChange={(e) => handleDateChange(e, program)}
                className="border border-gray-300 p-2 rounded-md"
              />

              <label className="text-sm">Expire Date</label>
              <input
                type="date"
                value={qualifiedPrograms[program]?.expireDate || ""}
                readOnly
                className="border border-gray-300 p-2 rounded-md bg-gray-200 cursor-not-allowed"
              />
            </div>
          )}

          {/* Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={program}
              checked={!!qualifiedPrograms[program]}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
            />
            <span className="text-sm">{program}</span>
          </label>
        </div>
      )
    )}
  </div>
</div>




              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateprofileFood;