import React, { useState, useEffect } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";

const CreateprofileFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    dob: "",
    employeeId: "NE1509",
    profilePicture: null,
  });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

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

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Account Created!\nName: ${formData.name}\nEmail: ${formData.email}\nRole: ${formData.role}\nPhone: ${formData.phone}\nDOB: ${formData.dob}\nAddress: ${formData.address}`);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      address: "",
      dob: "",
      employeeId: "NE15026",
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col`}>
      {/* Header */}
      <Navbar />

     {/* Dark Mode Button */}
            <div className="absolute top-[19%] right-8 transform -translate-y-1/2">
              <button
                onClick={() => {
                  setDarkMode(!darkMode);
                  document.documentElement.classList.toggle("dark", !darkMode); // Toggle the dark mode class on the root element
                }}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-md transition font-bold"
              >
                {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
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
            <label className={`text-xl font-semibold bg-blue-500 py-2 px-4 rounded-lg inline-block mb-6 ${darkMode ? "text-white" : "text-black"}`}>
              Create Profile
            </label>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                    <div>
                      <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-black" // Always set text color to black
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
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md text-black "
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500  text-black "
                  required
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
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>

                <div>
                  <label className={`font-medium ${darkMode ? "text-white" : "text-black"}`}>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-black "
                    required
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
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-black "
                  rows="2"
                  required
                ></textarea>
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
