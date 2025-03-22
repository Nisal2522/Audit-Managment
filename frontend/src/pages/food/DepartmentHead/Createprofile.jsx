import React, { useState, useEffect } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";
import { createEmployee } from "../../../services/employeeservice";
import bcrypt from "bcryptjs";
import { FaSun, FaMoon } from "react-icons/fa";

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
    department: "Food",
  });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [qualifiedPrograms, setQualifiedPrograms] = useState({
    GOTS: { selected: false, startDate: "", expireDate: "" },
    GRS: { selected: false, startDate: "", expireDate: "" },
    OCS: { selected: false, startDate: "", expireDate: "" },
    RCS: { selected: false, startDate: "", expireDate: "" },
    SRCCS: { selected: false, startDate: "", expireDate: "" },
    REGENAGRI: { selected: false, startDate: "", expireDate: "" },
    "BCI Cotton": { selected: false, startDate: "", expireDate: "" },
    PPRS: { selected: false, startDate: "", expireDate: "" },
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

  // Handle Date Change for Qualified Programs
  const handleDateChange = (e, program, field) => {
    const { value } = e.target;
    setQualifiedPrograms((prev) => ({
      ...prev,
      [program]: {
        ...prev[program],
        [field]: value,
        ...(field === "startDate" && {
          expireDate: new Date(new Date(value).setFullYear(new Date(value).getFullYear() + 1))
            .toISOString()
            .split("T")[0],
        }),
      },
    }));
  };

  // Handle Program Selection
  const handleProgramSelection = (program) => {
    setQualifiedPrograms((prev) => ({
      ...prev,
      [program]: {
        ...prev[program],
        selected: !prev[program].selected,
      },
    }));
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

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if all form fields are filled
    const isFormComplete = Object.values(formData).every((value) => value !== "");
    // Convert `qualifiedPrograms` from an object to an array
    const formattedPrograms = Object.entries(qualifiedPrograms)
      .filter(([_, program]) => program.selected) // Keep only selected programs
      .map(([name, program]) => ({
        name,
        startDate: program.startDate || "",
        expireDate: program.expireDate || "",
      }));

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
      // Hash the password before sending it to the backend
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt); // Hash the password
      // Send data to backend, including the hashed password
      await createEmployee({
        ...formData,
        password: hashedPassword, // Replace plain text password with hashed password
        qualifiedPrograms: formattedPrograms,
        employeeId: formData.employeeId,
      });

      // Show the popup
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 4000);

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
      setQualifiedPrograms({
        GOTS: { selected: false, startDate: "", expireDate: "" },
        GRS: { selected: false, startDate: "", expireDate: "" },
        OCS: { selected: false, startDate: "", expireDate: "" },
        RCS: { selected: false, startDate: "", expireDate: "" },
        SRCCS: { selected: false, startDate: "", expireDate: "" },
        REGENAGRI: { selected: false, startDate: "", expireDate: "" },
        "BCI Cotton": { selected: false, startDate: "", expireDate: "" },
        PPRS: { selected: false, startDate: "", expireDate: "" },
      });
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
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 text-xl focus:outline-none transform duration-200 ease-in-out hover:scale-105 -translate-y-1 text-2xl ${
            darkMode ? "text-white" : "text-gray-700"
          } cursor-pointer`}
        >
          {darkMode ? <FaSun className="inline-block" /> : <FaMoon className="inline-block" />}
        </button>
      </div>
      <div className="flex flex-grow">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Section */}
        <main className="flex-grow flex items-center justify-center p-6">
          {/* Card Container */}
          <div
            className={`shadow-lg rounded-xl p-8 w-full max-w-3xl transition duration-300 ${
              darkMode ? "bg-blue-300 text-white" : "bg-blue-300 text-black"
            }`}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            {/* Label with Dynamic Text Color */}
            <label
              className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block shadow-lg font-poppins ${
                darkMode ? "text-white" : "text-white"
              }`}
              style={{ backgroundColor: "#064979" }}
            >
              Create Account
            </label>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className={`font-medium font-poppins${darkMode ? "text-black" : "text-black"}`}>
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
                  <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}
                    required
                  />
                </div>
              </div>
              {/* Password (Automatically generated) */}
              <div className="mb-4 relative">
                <label htmlFor="password" className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>
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
                  className="p-2 bg-[#064979] text-white rounded-md hover:bg-[#043a63] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-poppins"
                >
                  Regenerate Password
                </button>
              </div>
              {/* Employee ID */}
              <div>
                <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}
                  readOnly
                />
              </div>
              {/* Role */}
              <div>
                <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="Auditor">Auditor</option>
                  <option value="Planner">Planner</option>
                  <option value="Reviwer">Reviewer</option>
                  <option value="Project creator">Project Creator</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              {/* Phone & DOB */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}
                    required
                  />
                </div>
                <div>
                  <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                      ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                    `}
                    required
                  />
                </div>
              </div>
              {/* Address */}
              <div>
                <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                    ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                  `}
                  rows="2"
                  required
                ></textarea>
              </div>
              {/* Qualified Programs Section */}
              <div className="mt-6">
                <label className={`font-medium font-poppins ${darkMode ? "text-white" : "text-black"}`}>
                  Qualified Programs
                </label>
                <div className="grid grid-cols-2 gap-4 mt-2 font-medium font-poppins">
                  {Object.entries(qualifiedPrograms).map(([program, data]) => (
                    <div key={program} className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={data.selected}
                          onChange={() => handleProgramSelection(program)}
                          className="mr-2"
                        />
                        <span className={`${darkMode ? "text-white" : "text-black"}`}>
                          {program}
                        </span>
                      </div>
                      {data.selected && (
                        <div className="flex flex-col space-y-2">
                          {/* Start Date Label and Input */}
                          <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={data.startDate}
                            onChange={(e) => handleDateChange(e, program, "startDate")}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                              ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                            `}
                            placeholder="Start Date"
                          />
                          {/* Expire Date Label and Input */}
                          <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>
                            Expire Date
                          </label>
                          <input
                            type="date"
                            value={data.expireDate}
                            onChange={(e) => handleDateChange(e, program, "expireDate")}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                              ${darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"}
                            `}
                            placeholder="Expire Date"
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#064979] text-white font-medium font-poppins py-2 rounded-md hover:bg-[#043a63] transition duration-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </main>
      </div>
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-2xl font-bold ${
              darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
            }`}
          >
            Employee created successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateprofileFood;