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

  const [currentStep, setCurrentStep] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [validationError, setValidationError] = useState("");

  const steps = [
    { id: 1, name: "Personal Information" },
    { id: 2, name: "Account Details" },
    { id: 3, name: "Qualified Programs" },
  ];

  const generateEmployeeId = () => {
    const prefix = "AFD";
    const randomNum = Math.floor(Math.random() * 10000) + 1000;
    return `${prefix}${randomNum}`;
  };

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

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleProgramSelection = (program) => {
    setQualifiedPrograms((prev) => ({
      ...prev,
      [program]: {
        ...prev[program],
        selected: !prev[program].selected,
      },
    }));
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email || !formData.phone || !formData.dob || !formData.address) {
          setValidationError("Please fill in all fields in Personal Information.");
          return false;
        }
        break;
      case 2:
        if (!formData.password || !formData.role) {
          setValidationError("Please fill in all fields in Account Details.");
          return false;
        }
        break;
      case 3:
        const selectedPrograms = Object.values(qualifiedPrograms).filter((program) => program.selected);
        if (selectedPrograms.length === 0) {
          setValidationError("Please select at least one Qualified Program.");
          return false;
        }
        for (const program of selectedPrograms) {
          if (!program.startDate) {
            setValidationError("Please provide a Start Date for the selected program(s).");
            return false;
          }
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
      return;
    }
    setValidationError("");
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
      return;
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(formData.password, salt);
      await createEmployee({
        ...formData,
        password: hashedPassword,
        qualifiedPrograms: Object.entries(qualifiedPrograms)
          .filter(([_, program]) => program.selected)
          .map(([name, program]) => ({
            name,
            startDate: program.startDate || "",
            expireDate: program.expireDate || "",
          })),
        employeeId: formData.employeeId,
      });

      setIsPopupVisible(true);
      setValidationError("Employee created successfully!");
      setTimeout(() => {
        setIsPopupVisible(false);
        setCurrentStep(1); // Reset to the first step
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
      setValidationError("Error creating account. Please try again.");
      setIsPopupVisible(true);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>
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
            <div>
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Phone Number</label>
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
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Date of Birth</label>
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
            <div className="col-span-2">
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Address</label>
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
          </div>
        );
      case 2:
        return (
          <div>
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
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={handleRegeneratePassword}
                className="p-2 bg-[#064979] text-white rounded-md hover:bg-[#043a63] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-poppins"
              >
                Regenerate Password
              </button>
            </div>
            <div>
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Employee ID</label>
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
            <div>
              <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 
                  ${darkMode ? "border-gray-600 bg-gray-800 text-white font-poppins font-semibold" : "border-gray-300 bg-gray-100 text-black font-poppins font-semibold"}
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
          </div>
        );
      case 3:
        return (
          <div className="mt-6">
            <label className={`font-medium font-poppins ${darkMode ? "text-black" : "text-black"}`}>
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
                    <span className={`${darkMode ? "text-black" : "text-black"}`}>
                      {program}
                    </span>
                  </div>
                  {data.selected && (
                    <div className="flex flex-col space-y-2">
                      <label className={`font-medium ${darkMode ? "text-black" : "text-black"}`}>
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
                      <label className={`font-medium ${darkMode ? "text-black" : "text-black"}`}>
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
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col`}>
     <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
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
      {!isSidebarVisible && <Sidebar />}
        <main className="flex-grow flex items-center justify-center p-6">
          <div
            className={`shadow-lg rounded-xl p-8 w-full max-w-3xl transition duration-300 ${
              darkMode ? "bg-blue-300 text-white" : "bg-blue-300 text-black"
            }`}
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <label
              className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block shadow-lg font-poppins ${
                darkMode ? "text-white" : "text-white"
              }`}
              style={{ backgroundColor: "#064979" }}
            >
              Create Account
            </label>
            <div className="mt-8">
              <div className="flex justify-between mb-8">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep >= step.id ? "bg-[#064979] text-white" : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className={`ml-2 ${currentStep >= step.id ? "font-bold" : "text-gray-500"}`}>
                      {step.name}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {renderStepContent()}
                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < steps.length ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="p-2 bg-[#064979] text-white rounded-md hover:bg-[#043a63] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="p-2 bg-[#064979] text-white rounded-md hover:bg-[#043a63] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
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
            {validationError}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateprofileFood;