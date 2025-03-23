import React, { useState, useEffect } from "react";
import Navbar from "../../../Components/NavBar";
import Sidebar from "./Sidebar";
import { createEmployee } from "../../../services/employeeservice";
import bcrypt from "bcryptjs";
import { FaSun, FaMoon, FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarker,FaKey,FaIdCard,FaUserTie} from "react-icons/fa";

const CreateprofileFood = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    address: "",
    dob: "",
    employeeId: "",
    profilePicture: null,
    department: "Food",
  });
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [currentStep, setCurrentStep] = useState(1); // Track current step in the form
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

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Function to generate random Employee ID
  const generateEmployeeId = () => {
    const prefix = "AFD"; // Food department prefix
    const randomNum = Math.floor(Math.random() * 10000) + 1000; // Generates a number between 1000 and 19999
    return `${prefix}${randomNum}`;
  };

  // Function to generate random Password (based on the user's name)
  const generatePassword = (name) => {
    const namePart = name.replace(/\s+/g, "").slice(2, 6).toLowerCase(); // Remove spaces and use first 3 characters
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Name validation: No numbers allowed
    if (name === "name") {
      const namePattern = /^[A-Za-z\s]*$/;
      if (!namePattern.test(value)) {
        setErrors((prev) => ({ ...prev, name: "Name must not contain numbers or special characters." }));
      } else {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }

    // Phone validation: Only 10 digits allowed
    if (name === "phone") {
      const phonePattern = /^\d{10}$/;
      if (!phonePattern.test(value)) {
        setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
      } else {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all form fields are filled
    const isFormComplete = Object.values(formData).every((value) => value !== "");

    // Ensure there are no errors before submitting
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setModalMessage("Please correct the errors before submitting.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
      return;
    }

    // Convert `qualifiedPrograms` from an object to an array
    const formattedPrograms = Object.entries(qualifiedPrograms)
      .filter(([_, program]) => program.selected) // Keep only selected programs
      .map(([name, program]) => ({
        name,
        startDate: program.startDate || "",
        expireDate: program.expireDate || "",
      }));

    if (formattedPrograms.length === 0) {
      setModalMessage("Please select at least one Qualified Program before submitting.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
      return;
    }

    // Check if all selected programs have Start Dates
    const isDateProvided = formattedPrograms.every((program) => program.startDate);
    if (!isDateProvided) {
      setModalMessage("Please provide a Start Date for the selected program(s) before submitting.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
      return;
    }

    if (!isFormComplete) {
      setModalMessage("Please fill in all fields before submitting.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
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

      // Show success message
      setModalMessage("Employee created successfully!");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds

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
      setCurrentStep(1); // Reset progress bar
    } catch (error) {
      setModalMessage("Error creating account. Please try again.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col`}>
      {/* Header */}
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      {/* Dark Mode Button */}
      <div className="absolute top-[19%] right-8 transform -translate-y-1/2">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="flex flex-grow">
        {/* Sidebar */}
        {!isSidebarVisible && <Sidebar />}

        {/* Main Section */}
        <main className="flex-grow flex items-center justify-center p-6">
          {/* Card Container */}
          <div className={`shadow-lg rounded-xl p-8 w-full max-w-3xl transition duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-[#022847] text-black"}`}>
            {/* Progress Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span className="text-white">1</span>
                </div>
                <span className="text-white font-poppins">Personal Info</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span className="text-white">2</span>
                </div>
                <span className="text-white font-poppins">Contact Info</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span className="text-white">3</span>
                </div>
                <span className="text-white font-poppins">Qualified Programs</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                        <FaUser className="mr-2" /> Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                        <FaEnvelope className="mr-2" /> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                        }`}
                        required
                      />
                    </div>
                  </div>
                  {/* Password (Automatically generated) */}
                  <div className="mb-4 relative">
                    <label htmlFor="password" className={`block font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                      <FaKey className="mr-2" /> Password
                    </label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      value={formData.password}
                      readOnly
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                      }`}
                    />
                  </div>
                  {/* Button to regenerate password */}
                  <div className="mb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleRegeneratePassword}
                      className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
                    >
                      Regenerate Password
                    </button>
                  </div>
                  {/* Employee ID */}
                  <div>
                    <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                      <FaIdCard className="mr-2" /> Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                      }`}
                      readOnly
                    />
                  </div>
                  {/* Role */}
                  <div>
                    <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                      <FaUserTie className="mr-2" /> Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                      }`}
                      required
                    >
                      <option value="" className="font-poppins">Select Role</option>
                      <option value="Auditor" className="font-poppins">Auditor</option>
                      <option value="Planner" className="font-poppins">Planner</option>
                      <option value="Reviewer" className="font-poppins">Reviewer</option>
                      <option value="Project creator" className="font-poppins">Project Creator</option>
                      <option value="Contractor" className="font-poppins">Contractor</option>
                    </select>
                  </div>
                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const namePattern = /^[A-Za-z\s]*$/;
                      if (!namePattern.test(formData.name)) {
                        setModalMessage("Full Name must not contain numbers or special characters. Please re-enter.");
                        setIsModalOpen(true);
                        setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Next
                  </button>
                </>
              )}
              {currentStep === 2 && (
                <>
                  {/* Phone & DOB */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                        <FaPhone className="mr-2" /> Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100"
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                        <FaCalendar className="mr-2" /> Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                          darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                        }`}
                        required
                      />
                    </div>
                  </div>
                  {/* Address */}
                  <div>
                    <label className={`font-poppins flex items-center ${darkMode ? "text-white" : "text-white"}`}>
                      <FaMapMarker className="mr-2" /> Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                        darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                      }`}
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const phonePattern = /^\d{10}$/;
                        if (!phonePattern.test(formData.phone)) {
                          setModalMessage("Phone number must be exactly 10 digits. Please re-enter.");
                          setIsModalOpen(true);
                          setTimeout(() => setIsModalOpen(false), 3000); // Auto-dismiss after 3 seconds
                          return;
                        }
                        setCurrentStep(3);
                      }}
                      className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
              {currentStep === 3 && (
                <>
                  {/* Qualified Programs Section */}
                  <div className="mt-6">
                    <label className={`text-lg font-poppins ${darkMode ? "text-white" : "text-white"}`}>Qualified Programs</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(qualifiedPrograms).map(([program, data]) => (
                        <div key={program} className="flex flex-col space-y-2 text-white font-poppins">
                          <div className="flex items-center text-white font-poppins">
                            <input
                              type="checkbox"
                              checked={data.selected}
                              onChange={() => handleProgramSelection(program)}
                              className="mr-2"
                            />
                            <span className={`${darkMode ? "text-white" : "text-white"}`}>{program}</span>
                          </div>
                          {data.selected && (
                            <div className="flex flex-col space-y-2">
                              {/* Start Date Label and Input */}
                              <label className={`font-poppins ${darkMode ? "text-white" : "text-white"}`}>Start Date</label>
                              <input
                                type="date"
                                value={data.startDate}
                                onChange={(e) => handleDateChange(e, program, "startDate")}
                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                  darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
                                }`}
                                placeholder="Start Date"
                              />
                              {/* Expire Date Label and Input */}
                              <label className={`font-poppins ${darkMode ? "text-white" : "text-white"} font-normal`}>Expire Date</label>
                              <input
                                type="date"
                                value={data.expireDate}
                                onChange={(e) => handleDateChange(e, program, "expireDate")}
                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
                                  darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-gray-100 text-black"
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
                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </main>
      </div>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Message</h2>
            <p className="text-gray-700 dark:text-gray-300">{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateprofileFood;