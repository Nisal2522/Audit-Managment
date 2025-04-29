//frontend
import React, { useState, useEffect } from "react";
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/Sidebar";
import { createEmployee, getEmployees } from "../../../services/employeeservice";
import bcrypt from "bcryptjs";
import { FaSun, FaMoon } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [activeTab, setActiveTab] = useState('create');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [employeeStats, setEmployeeStats] = useState(null);

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
    const randomNum = Math.floor(Math.random() * 10000) + 1000;
    return `${prefix}${randomNum}`;
  };

  // Function to generate random Password
  const generatePassword = (name) => {
    const namePart = name.replace(/\s+/g, '').slice(2, 6).toLowerCase();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const specialChars = "!@#$%^&*";
    const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
    return `${namePart}${randomNum}${randomSpecialChar}`;
  };

  const handleRegeneratePassword = () => {
    const newPassword = generatePassword(formData.name);
    setFormData((prev) => ({ ...prev, password: newPassword }));
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
    const employeeId = generateEmployeeId();
    const password = generatePassword(formData.name);
    setFormData((prev) => ({ ...prev, employeeId, password }));
  }, []);

  // Fetch employee statistics when tab changes to statistics
  useEffect(() => {
    if (activeTab === 'statistics') {
      fetchEmployeeStats();
    }
  }, [activeTab]);

  const fetchEmployeeStats = async () => {
    try {
      const employees = await getEmployees();
      console.log('Fetched employees:', employees); // Debug log
      
      // Ensure employees is an array before reducing
      if (!Array.isArray(employees)) {
        console.error('Employees data is not an array:', employees);
        setEmployeeStats({});
        return;
      }
  
      // Count employees by role with null/undefined checks
      const roleCounts = employees.reduce((acc, employee) => {
        if (employee && employee.role) {
          acc[employee.role] = (acc[employee.role] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('Role counts:', roleCounts); // Debug log
      setEmployeeStats(roleCounts);
    } catch (error) {
      console.error("Error fetching employee stats:", error);
      setEmployeeStats({}); // Set empty object on error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Name validation
    if (name === "name") {
      const namePattern = /^[A-Za-z\s]*$/;
      if (!namePattern.test(value)) {
        setErrors((prev) => ({ ...prev, name: "Name must not contain numbers" }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }
  
    // Phone validation
    if (name === "phone") {
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number must be 10 digits" }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isFormComplete = Object.values(formData).every((value) => value !== "");
  
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("Please correct the errors before submitting.");
      return;
    }
  
    const formattedPrograms = Object.entries(qualifiedPrograms)
      .filter(([_, program]) => program.selected)
      .map(([name, program]) => ({
        name,
        startDate: program.startDate || "",
        expireDate: program.expireDate || "",
      }));
  
    if (formattedPrograms.length === 0) {
      alert("Please select at least one Qualified Program before submitting.");
      return;
    }
  
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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);
  
      // Send both plain text and hashed passwords to backend
      await createEmployee({
        ...formData,
        password: formData.password, // Plain text password for email
        hashedPassword: hashedPassword, // Hashed password for database
        qualifiedPrograms: formattedPrograms,
        employeeId: formData.employeeId,
      });
  
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 4000);
  
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

  
  // Prepare data for the chart
  const getChartData = () => {
    if (!employeeStats) return null;
    
    const roles = Object.keys(employeeStats);
    const counts = Object.values(employeeStats);
    
    return {
      labels: roles,
      datasets: [
        {
          label: 'Number of Employees',
          data: counts,
          backgroundColor: darkMode ? '#3b82f6' : '#064979',
          borderColor: darkMode ? '#1e40af' : '#04355a',
          borderWidth: 2,
          font: {
            family: "'Poppins', sans-serif", // Poppins font family
            size: 24, // Title font size
            
          },
          
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: true,
        text: 'Employees by Role',
        color: darkMode ? '#e5e7eb' : '#374151',
        font: {
          family: "'Poppins', sans-serif", // Poppins font family
          size: 24, // Title font size
          
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
          callback: function(value) {
            if (value % 1 === 0) {
              return value;
            }
          },
          stepSize: 1
        },
        
        grid: {
          color: darkMode ? '#4b5563' : '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: darkMode ? '#e5e7eb' : '#374151',
        },
        grid: {
          color: darkMode ? '#4b5563' : '#e5e7eb',
        },
        
      },
    },
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <div className="flex flex-grow">
        {!isSidebarVisible && <Sidebar />}
        <main className="flex-grow p-6">
         <div className="max-w-6xl mx-auto">
                   <button 
                         onClick={handleToggleDarkMode}
                         className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out ml-[1130px]  "
                         >
                         {darkMode ? (
                           <FaSun className="w-5 h-5 text-white" />
                         ) : (
                           <FaMoon className="w-5 h-5 text-white" />
                         )}
                       </button>
            
            {/* Header Card */}
            <div className={`${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white rounded-lg shadow-lg p-4 mb-8 w-[1100px] -mt-10 `}>
              <h1 className="text-2xl font-bold font-poppins">Employee Management</h1>
              <p className={`${darkMode ? "text-gray-300" : "text-blue-100"} font-poppins`}>Create and manage employee accounts</p>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${darkMode ? "border-gray-700" : "border-gray-200"} mb-6`}>
              <button
                className={`py-2 px-4 font-medium font-poppins ${activeTab === 'create' ? 
                  `${darkMode ? "text-blue-400 border-b-2 border-white" : "text-[#064979] border-b-2 border-[#064979]"}` : 
                  `${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#064979]"}`}`}
                onClick={() => setActiveTab('create')}
              >
                Create Account
              </button>
              <button
                className={`py-2 px-4 font-medium font-poppins ${activeTab === 'statistics' ? 
                  `${darkMode ? "text-blue-400 border-b-2 border-white" : "text-[#064979] border-b-2 border-[#064979]"}` : 
                  `${darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-[#064979]"}`}`}
                onClick={() => setActiveTab('statistics')}
              >
                Statistics
              </button>
            </div>

            {activeTab === 'create' ? (
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
                <div className={`${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white rounded-lg shadow-lg p-4 mb-6`}>
                  <h2 className="text-lg font-semibold text-white border-b pb-2 mb-2 font-poppins">Create Acoount</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                          darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-sm font-poppins">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                          darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-4 relative">
                    <label className={`block text-sm font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Password
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      readOnly
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                        darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                      }`}
                    />
                  </div>

                  {/* Regenerate Password Button */}
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRegeneratePassword}
                      className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#064979] text-sm font-poppins ${
                        darkMode ? "bg-[#064979] hover:bg-blue-700 text-white" : "bg-[#064979] hover:bg-[#04355a] text-white"
                      }`}
                    >
                      Regenerate Password
                    </button>
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                        darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                      }`}
                      readOnly
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                        darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                      }`}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Auditor">Auditor</option>
                      <option value="Planner">Planner</option>
                      <option value="Reviewer">Reviewer</option>
                      <option value="Project creator">Project Creator</option>
                      <option value="Contractor">Contractor</option>
                    </select>
                  </div>

                  {/* Phone & DOB */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                          darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm font-poppins">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                          darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                        darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                      }`}
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  {/* Qualified Programs Section */}
                  <div className="mt-6">
                    <label className={`text-lg font-semibold font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Qualified Programs
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(qualifiedPrograms).map(([program, data]) => (
                        <div key={program} className="flex flex-col space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={data.selected}
                              onChange={() => handleProgramSelection(program)}
                              className="mr-2"
                            />
                            <span className={`font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                              {program}
                            </span>
                          </div>
                          {data.selected && (
                            <div className="flex flex-col space-y-2">
                              <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => handleDateChange(e, program, "startDate")}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                                }`}
                                placeholder="Start Date"
                              />
                            
                              <label className={`font-medium font-poppins ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Expire Date
                              </label>
                              <input
                                type="date"
                                value={data.expireDate}
                                onChange={(e) => handleDateChange(e, program, "expireDate")}
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#064979] focus:border-transparent shadow-sm ${
                                  darkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300 bg-gray-100"
                                }`}
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
                    className={`w-full py-2 rounded-md transition duration-300 font-medium font-poppins ${
                      darkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#064979] hover:bg-[#04355a] text-white"
                    }`}
                  >
                    Create Account
                  </button>
                </form>
              </div>
            ) : (
              <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
              <div className={`${darkMode ? "bg-[#064979]" : "bg-[#064979]"} text-white rounded-lg shadow-lg p-4 mb-6`}>
                <h2 className="text-lg font-semibold text-white border-b pb-2 mb-2 font-poppins">Statistics</h2>
              </div>
              
              <div className={`${darkMode ? "text-gray-300" : "text-gray-700"} font-poppins`}>
                {employeeStats ? (
                  <div className="flex flex-col lg:flex-row gap-6"> {/* Changed to flex layout */}
                    {/* Bar Chart - now takes half width */}
                    <div className="flex-1 h-100 min-w-0"> {/* Added min-w-0 to prevent overflow */}
                      <Bar 
                        data={getChartData()} 
                        options={chartOptions} 
                      />
                    </div>
                    
                    {/* Stylish Compact Role Stats Card - now takes half width */}

                    <div className={`w-[300px] rounded-xl  shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      {/* Card Header */}

                      <div className={`p-4 w-[300px] ${darkMode ? "bg-[#064979]" : "bg-[#064979]"} border-b ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                        <h3 className={`text-lg  font-semibold font-poppins uppercase tracking-wider ${darkMode ? "text-white" : "text-white"}`}>
                          Employee Distribution
                        </h3>
                      </div>
            
                      {/* Card Content */}

                      <div className="p-2 space-y-4 w-[280px] ">
                        {Object.entries(employeeStats).map(([role, count]) => (
                          <div key={role} className="flex items-center justify-between mt-4 ">
                            <div className="flex items-center">
                              <div className={`w-4 h-2 rounded-full mr-3 ${darkMode ? "bg-blue-400" : "bg-blue-500"}`}></div>
                              <span className={`text-sm font-semibold font-poppins ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{role}</span>
                            </div>
                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${darkMode ? "bg-blue-900 text-blue-100" : "bg-blue-100 text-blue-800"}`}>
                              {count}
                            </span>
                          </div>
                        ))}
                      </div>
            

                      {/* Card Footer - Total */}

                      <div className={`px-4 py-3 w-[300px] mt-14 text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"} border-t ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
                        <div className="inline-flex items-center">
                          <span className={`text-lg font-semibold mr-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Total Employees:</span>
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${darkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"}`}>
                            {Object.values(employeeStats).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    Loading employee statistics...
                  </div>
                )}
              </div>
            </div>
                  

                 
            )}
          </div>

          {isPopupVisible && (
            <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 text-xl font-semibold font-poppins px-5 py-2 rounded-md shadow-md transition-opacity duration-300 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-[#064979]"
            }`}>
              Employee created successfully!
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CreateprofileFood;