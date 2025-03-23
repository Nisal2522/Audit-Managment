import React, { useState, useEffect } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";
import axios from "axios";
import { FaEdit, FaTrash , FaBell ,FaTimes ,FaDownload ,FaSun,FaMoon  } from "react-icons/fa";
import jsPDF from "jspdf";
import  autoTable  from "jspdf-autotable";
import logo from '../../../assets/logon.png';
import { utils, writeFile } from "xlsx"; // For Excel download



const EmployeeStatusFood = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [statusTab, setStatusTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Track the selected employee for the popup
  const [showPopup, setShowPopup] = useState(false); // Control the visibility of the popup
  const [editMode, setEditMode] = useState(false); // Track whether edit mode is active
  const [isEditing, setIsEditing] = useState(false); 
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);


  // Load the notification state from localStorage on initial render
  useEffect(() => {
    const savedNotificationState = localStorage.getItem("hasNewNotifications");
    if (savedNotificationState === "true") {
      setHasNewNotifications(true);
    }
  }, []);



  // Save the notification state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("hasNewNotifications", hasNewNotifications.toString());
  }, [hasNewNotifications]);



  // Fetch employees and check for notifications
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5005/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);


  const handleProgramDateChange = (index, field, value) => {
    setSelectedEmployee((prevEmployee) => {
      const updatedPrograms = [...prevEmployee.qualifiedPrograms];
      updatedPrograms[index] = { ...updatedPrograms[index], [field]: value };

      if (field === "startDate") {
        const startDate = new Date(value);
        const expireDate = new Date(startDate);
        expireDate.setFullYear(startDate.getFullYear() + 1);
        updatedPrograms[index].expireDate = expireDate.toISOString().split("T")[0];
      }

      return { ...prevEmployee, qualifiedPrograms: updatedPrograms };
    });
  };

  useEffect(() => {
    if (employees.length > 0) {
      checkExpiryNotifications();
    }
  }, [employees]);

  // Function to check for expiry notifications
  const checkExpiryNotifications = () => {
    const today = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(today.getMonth() + 2); // 2 months from now
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3); // 3 months from now

    const newNotifications = [];

    employees.forEach((employee) => {
      employee.qualifiedPrograms.forEach((program) => {
        const expireDate = new Date(program.expireDate);
        if (expireDate <= threeMonthsFromNow && expireDate >= today) {
          let status = "";
          if (expireDate <= twoMonthsFromNow) {
            status = "red"; // Expires in 2 months or less
          } else if (expireDate <= threeMonthsFromNow) {
            status = "yellow"; // Expires in 3 months
          }

          newNotifications.push({
            employeeName: employee.name,
            programName: program.programname,
            expireDate: program.expireDate,
            status,
          });
        }
      });
    });

    setNotifications(newNotifications);

    // If there are new notifications, set the flag
    if (newNotifications.length > 0) {
      setHasNewNotifications(true);
    }
  };



  const NotificationModal = ({ notifications, darkMode, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className={`w-11/12 max-w-2xl p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold font-poppins ">Notifications</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-20 ${darkMode ? "hover:bg-white" : "hover:bg-gray-800"}`}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg font-poppins ${
                  notification.status === "red"
                    ? "bg-red-100 text-red-800"
                    : notification.status === "yellow"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>
                  {notification.employeeName}'s {notification.programName} expires on{" "}
                  {notification.expireDate}
                </p>
              </div>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
      </div>
    );
  };

  const handleBellClick = () => {
    setShowNotifications(true);
    setHasNewNotifications(false); // Reset new notifications flag when the bell is clicked
  };


  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5005/api/employees/${selectedEmployee._id}`,
        selectedEmployee
      );
  
      if (response.status === 200) {
        // Update the local state with the new data
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp._id === selectedEmployee._id ? response.data : emp
          )
        );
        setIsEditing(false); // Exit edit mode
        setUpdateSuccess(true);
        setEditMode(false); // Close the edit form

        setTimeout(() => {
          setUpdateSuccess(false);
        }, 4000);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };


  const handleDelete = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5005/api/employees/${employeeId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete employee");
      }
  
      console.log("Employee deleted successfully");
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
      setDeleteSuccess(true); 
      setTimeout(() => setDeleteSuccess(false), 4000); // Hide success message after 3 seconds
    } catch (error) {
      console.error("Error deleting employee:", error.message);
    }
  };

  const handleDownload = (type) => {
  const status = document.querySelector('select[name="status"]').value;
  const creationDate = document.querySelector('input[name="creationDate"]').value;

  // Get today's date in the format "YYYY-MM-DD"
  const today = new Date().toISOString().split("T")[0];

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesStatus = status === "all" || emp.status === status;
    const matchesCreationDate =
      !creationDate || new Date(emp.createdAt).toISOString().split("T")[0] === creationDate;
    return matchesStatus && matchesCreationDate;
  });

  // If no employees are found, display a message
  if (filteredEmployees.length === 0) {
    if (type === "pdf") {
      const doc = new jsPDF();

      // Load the logo
      const logoImage = new Image();
      logoImage.src = logo;

      logoImage.onload = () => {
        const logoWidth = 15; // Adjust the width of the logo
        const logoHeight = (logoImage.height * logoWidth) / logoImage.width;

        // Add logo to the PDF
        doc.addImage(logoImage, "PNG", 10, 10, logoWidth, logoHeight);

        // Use Poppins font style
        doc.setFont("Poppins", "normal");

        // Add "AuditFlow" text (bold) in the same line as the logo
        doc.setFont("Poppins", "bold");
        doc.setFontSize(23);
        doc.setTextColor("#022847");
        doc.text("AuditFlow", 10 + logoWidth + 5, 15);

        // Add "EmployeeRegister - All Employees" on a new line
        doc.setFont("Poppins", "normal");
        doc.setFontSize(18);
        doc.text(`EmployeeRegister - ${status === "all" ? "All Employees" : status}`, 30, 25);

        // Add today's date
        doc.setFontSize(12);
        doc.setTextColor("#022847");
        doc.text(`Downloaded on: ${today}`, 30, 35);

        // Add "No employees found" message
        doc.setFontSize(14);
        doc.setTextColor("#ff0000"); // Red color for the message
        doc.text("No employees found.", 30, 45);

        // Save the PDF
        doc.save(`AuditFlow_EmployeeRegister_${status}_${creationDate || "all"}.pdf`);
        setShowDownloadPopup(false);
      };
    } else if (type === "excel") {
      // Create an empty Excel file with a message
      const worksheet = utils.json_to_sheet([{ Message: "No employees found." }]);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Employee Register");

      // Add today's date to the Excel file
      utils.sheet_add_aoa(worksheet, [[`Downloaded on: ${today}`]], { origin: "A2" });

      writeFile(workbook, `AuditFlow_EmployeeRegister_${status}_${creationDate || "all"}.xlsx`);
      setShowDownloadPopup(false);
    }
    return; // Exit the function early
  }

  // If employees are found, proceed with the download
  if (type === "pdf") {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Load the logo
    const logoImage = new Image();
    logoImage.src = logo;

    logoImage.onload = () => {
      const logoWidth = 15; // Adjust the width of the logo
      const logoHeight = (logoImage.height * logoWidth) / logoImage.width;

      // Add logo to the PDF
      doc.addImage(logoImage, "PNG", 10, 10, logoWidth, logoHeight);

      // Use Poppins font style
      doc.setFont("Poppins", "normal");

      // Add "AuditFlow" text (bold) in the same line as the logo
      doc.setFont("Poppins", "bold");
      doc.setFontSize(23);
      doc.setTextColor("#022847");
      doc.text("AuditFlow", 10 + logoWidth + 5, 15);

      // Add "EmployeeRegister - All Employees" on a new line
      doc.setFont("Poppins", "normal");
      doc.setFontSize(18);
      doc.text(`EmployeeRegister - ${status === "all" ? "All Employees" : status}`, 30, 25);

      // Add today's date
      doc.setFontSize(12);
      doc.setTextColor("#022847");
      doc.text(`Downloaded on: ${today}`, 30, 35);

      // Prepare table data
      const tableData = filteredEmployees.map((emp) => [
        emp.name,
        emp.employeeId,
        emp.role,
        emp.status,
        new Date(emp.createdAt).toLocaleDateString(),
      ]);

      autoTable(doc, {
        head: [["Name", "Employee ID", "Role", "Status", "Creation Date"]],
        body: tableData,
        startY: 44,
        theme: "grid",
        headStyles: {
          fillColor: [2, 40, 71],
          textColor: "#ffffff",
          fontStyle: "bold",
          fontSize: 12,
          cellPadding: 2,
        },
        bodyStyles: {
          textColor: "#333333",
          fontSize: 12,
          fontStyle: "bold",
          cellPadding: 3,
        },
        alternateRowStyles: {
          fillColor: "#e6f2ff",
        },
        styles: {
          lineColor: [44, 62, 80],
          lineWidth: 0.5,
          cellPadding: 5,
        },
        columnStyles: {
          0: { halign: "left" },
          1: { halign: "center" },
          2: { halign: "left" },
          3: { halign: "center" },
          4: { halign: "center" },
          5: { halign: "right" },
        },
        margin: { top: 50 },
      });

      // Save the PDF
      doc.save(`AuditFlow_EmployeeRegister_${status}_${creationDate || "all"}.pdf`);
      setShowDownloadPopup(false);
    };
  } else if (type === "excel") {
    // Prepare Excel data
    const excelData = filteredEmployees.map((emp) => ({
      Name: emp.name,
      "Employee ID": emp.employeeId,
      Role: emp.role,
      Status: emp.status,
      "Creation Date": new Date(emp.createdAt).toLocaleDateString(),
    }));

    // Create a worksheet
    const worksheet = utils.json_to_sheet(excelData);

    // Add today's date to the Excel file
    utils.sheet_add_aoa(worksheet, [[`Downloaded on: ${today}`]], { origin: -1 });

    // Create a workbook
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Employee Register");

    // Save the Excel file
    writeFile(workbook, `AuditFlow_EmployeeRegister_${status}_${creationDate || "all"}.xlsx`);
    setShowDownloadPopup(false);
  }
};




  // Filter employees based on search query, status, and online status
  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
      emp.status === activeTab &&
      (statusTab === null || (statusTab === "online" ? emp.online : !emp.online))
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      <div className="flex flex-grow">
      {!isSidebarVisible && <Sidebar />}
        <main className={`flex-grow p-8 rounded-lg shadow-xl ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          {/* Edit Mode: Show Employee Details Form */}
          {editMode ? (
  <div className="space-y-6">

        <div className="flex justify-between items-center w-full">
                <label
                  className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block font-poppins ${
                    darkMode ? "bg-[#064979] text-white" : "bg-[#064979] text-white"
                  } shadow-lg`}
                >
                  Edit Employee details of {selectedEmployee?.name}
                </label>
                
              </div>


    <form className="space-y-4 font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name Field (Read-Only) */}
        <div className="flex flex-col">
          <label className="font-bold font-poppins">Name:</label>
          <input
            type="text"
            name="name"
            value={selectedEmployee?.name}
            readOnly
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } opacity-60 cursor-not-allowed`}
          />
        </div>

        {/* Employee ID Field (Read-Only) */}
        <div className="flex flex-col">
          <label className="font-bold font-poppins">Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={selectedEmployee?.employeeId}
            readOnly
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } opacity-60 cursor-not-allowed`}
          />
        </div>

        {/* Phone Number Field (Editable) */}
        <div className="flex flex-col">
          <label className="font-bold font-poppins">Phone No:</label>
          <input
            type="text"
            name="phone"
            value={selectedEmployee?.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Address Field (Editable) */}
        <div className="flex flex-col">
          <label className="font-bold font-poppins">Address:</label>
          <input
            type="text"
            name="address"
            value={selectedEmployee?.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Email Field (Editable) */}
        <div className="flex flex-col">
          <label className="font-bold font-poppins">Email:</label>
          <input
            type="email"
            name="email"
            value={selectedEmployee?.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Role Field (Read-Only) */}
        <div className="flex flex-col">
          <label className="font-medium">Role:</label>
          <input
            type="text"
            name="role"
            value={selectedEmployee?.role}
            readOnly
            className={`p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-700 hover:border-blue-500 focus:border-blue-500"
                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
            } opacity-60 cursor-not-allowed`}
          />
        </div>

        {/* Qualification Programs Field */}
        <div className="flex flex-col">
          <label className="font-medium">Qualification Programs:</label>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
            {selectedEmployee?.qualifiedPrograms?.length > 0 ? (
              <div className="space-y-4">
                {selectedEmployee.qualifiedPrograms.map((program, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex flex-col space-y-2">
                      {/* Program Name */}
                      <div className="flex justify-between">
                        <span className="font-medium">Program Name:</span>
                        <span>{program.programname}</span>
                      </div>

                      {/* Start Date */}
                      <div className="flex justify-between">
                        <span className="font-medium">Start Date:</span>
                        <input
                          type="date"
                          value={program.startDate}
                          onChange={(e) => handleProgramDateChange(index, "startDate", e.target.value)}
                          disabled={!isEditing}
                          className={`p-1 border rounded focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
                              : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                          } ${!isEditing ? "cursor-not-allowed" : ""}`}
                        />
                      </div>

                      {/* Expire Date */}
                     {/* Expire Date (Read-Only) */}
                        <div className="flex justify-between">
                          <span className="font-medium">Expire Date:</span>
                          <input
                            type="date"
                            value={program.expireDate}
                            readOnly // Make the field read-only
                            className={`p-1 border rounded focus:ring-2 focus:ring-blue-500 ${
                              darkMode
                                ? "bg-gray-700 text-white border-gray-600 hover:border-blue-500 focus:border-blue-500"
                                : "bg-white text-black border-gray-300 hover:border-blue-500 focus:border-blue-500"
                            } opacity-60 cursor-not-allowed`} // Apply disabled styling
                          />
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No qualification programs available.</p>
            )}
          </div>
        </div>
        {/* Activate/Inactivate Toggle Button */}
        <div className="flex flex-col">
          <label className="font-medium">Status:</label>
          <div className="flex items-center">
            <span className={`mr-2 ${darkMode ? "text-white" : "text-gray-700"}`}>
              {selectedEmployee?.status === "active" ? "Active" : "Inactive"}
            </span>
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  const newStatus = selectedEmployee?.status === "active" ? "inactive" : "active";
                  handleInputChange({ target: { name: "status", value: newStatus } });
                }
              }}
              disabled={!isEditing}
              className={`relative w-12 h-6 rounded-full p-1 transition-colors duration-200 ${
                selectedEmployee?.status === "active"
                  ? "bg-green-500"
                  : "bg-red-500"
              } ${!isEditing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  selectedEmployee?.status === "active" ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </button>
          </div>
        </div>
        
            

        


      </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </form>
        </div>
      ) : (
      


            <>
              {/* Main Content */}
              <div className="flex justify-between items-center mb-6">
             <label
                className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block shadow-lg font-poppins ${
                  darkMode ? 'text-white' : 'text-white'
                }`}
                style={{ backgroundColor: darkMode ? "#064979" : "#064979" }}
              >
                Employee Status
              </label>

                <div className="flex items-center space-x-4 font-poppins" >
                  <input
                    type="text"
                    placeholder="Search employees by name"
                    className={`w-72 p-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
                        >
                           {darkMode ? <FaSun /> : <FaMoon />}
                        </button>

                 <div className="relative">
                    <FaBell
                      className={`text-2xl ${darkMode ? "text-white" : "text-gray-700"} cursor-pointer`}
                      onClick={handleBellClick}
                    />
                    {hasNewNotifications && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>



                   <div className="relative">
                   <FaDownload
                    className={`text-2xl ${darkMode ? "text-white" : "text-gray-700"} cursor-pointer`}
                    onClick={() => setShowDownloadPopup(true)}
                  />
                  {showDownloadPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          Download Options
                        </h2>

                        {/* Filter by Status (Active/Inactive) */}
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Filter by Status
                          </label>
                          <select
                            name="status"
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                            }`}
                          >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>

                        {/* Filter by Creation Date */}
                        <div className="mb-4">
                          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            Filter by Creation Date
                          </label>
                          <input
                            type="date"
                            name="creationDate"
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                              darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"
                            }`}
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                          <button
                            onClick={() => setShowDownloadPopup(false)}
                            className={`px-4 py-2 rounded-lg ${
                              darkMode
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                            }`}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDownload("pdf")} // Download as PDF
                            className={`px-4 py-2 rounded-lg ${
                              darkMode
                                ? "bg-[#022847] text-white hover:bg-[#064979]" // Dark mode styles
                                  : "bg-[#022847] text-white hover:bg-[#064979]"
                            }`}
                          >
                            Download as PDF
                          </button>
                          <button
                              onClick={() => handleDownload("excel")} // Download as Excel
                              className={`px-4 py-2 rounded-lg ${
                                darkMode
                                  ? "bg-[#022847] text-white hover:bg-[#064979]" // Dark mode styles
                                  : "bg-[#022847] text-white hover:bg-[#064979]" // Light mode styles
                              }`}
                            >
                              Download as Excel
                            </button>

                        </div>
                      </div>
                    </div>
                  )}
                                
                  </div>
                </div>
              </div>

              <div className="flex border-b mb-6 space-x-6  font-poppins ">
                {[
                  { id: "active", label: "Active Members" },
                  { id: "inactive", label: "Inactive Members" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-4 py-2 text-lg font-medium ${
                      activeTab === tab.id ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "active" && (
                <div className="flex border-b mb-6 space-x-6 font-poppins ">
                  {[
                    { id: "online", label: "Online" },
                    { id: "offline", label: "Offline" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`px-4 py-2 text-lg font-medium ${
                        statusTab === tab.id ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500 hover:text-blue-600"
                      }`}
                      onClick={() => setStatusTab(statusTab === tab.id ? null : tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <div className={`p-6 rounded-xl shadow-lg ${darkMode ? "bg-gray-700 text-white" : "bg-[#022847] text-white"}`}>
                  <h2 className="text-2xl font-semibold font-poppins">
                    {activeTab === "active" ? "Active Members" : "Inactive Members"}
                  </h2>
                  {filteredEmployees.length > 0 ? (
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEmployees.map((emp) => (
                        <li
                          key={emp._id}
                          className={`p-6 rounded-xl shadow-lg border flex items-center space-x-4 hover:scale-105 transition-transform duration-300 ${
                            darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                          onClick={() => {
                            setSelectedEmployee(emp); // Set the selected employee
                            setShowPopup(true); // Show the popup
                          }}
                        >
                          <img
                            src={emp.img || "https://randomuser.me/api/portraits/men/1.jpg"}
                            alt={emp.name}
                            className="w-12 h-12 rounded-full border-2 border-gray-300"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-lg font-poppins ">{emp.name}</span>
                            <span
                              className={`px-4 py-1 rounded-full text-sm font-semibold font-poppins  ${
                                emp.status === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                              }`}
                            >
                              {emp.status}
                            </span>
                          </div>
                          {emp.status === "active" && (
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-bold  font-poppins  ${
                                emp.online ? "bg-blue-200 text-blue-800" : "bg-red-200 text-red-800"
                              }`}
                            >
                              {emp.online ? "🟢 Online" : "🔴 Offline"}
                            </span>
                          )}
                        
                         
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 font-poppins">No employees found.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Popup for updating status */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-8 rounded-lg shadow-xl w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            {/* Popup Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-semibold font-poppins">Details of {selectedEmployee?.name}</h2>
              <div className="flex space-x-4">
                {/* Edit Icon */}
                <FaEdit
                  className={`text-xl cursor-pointer ${
                    darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                  }`}
                  onClick={() => {
                    console.log("Edit employee:", selectedEmployee);
                    setEditMode(true); // Enter edit mode
                    setShowPopup(false); // Close the popup
                  }}
                />
                {/* Delete Icon */}
                                  <FaTrash
                    className={`text-xl cursor-pointer ${
                      darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                    }`}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this employee?")) {
                        handleDelete(selectedEmployee._id); // Call the delete function
                        setShowPopup(false); // Close the popup after deletion
                      }
                    }}
                  />
              </div>
            </div>

            {/* Employee Details */}
            <div className="space-y-4">
              <div className="flex justify-between font-poppins ">
                <span className="font-medium font-poppins ">Name:</span>
                <span>{selectedEmployee?.name}</span>
              </div>
              <div className="flex justify-between font-poppins ">
                <span className="font-medium font-poppins ">Employee ID:</span>
                <span>{selectedEmployee?.employeeId} </span>
              </div>
              <div className="flex justify-between font-poppins ">
                <span className="font-medium font-poppins ">Email:</span>
                <span>{selectedEmployee?.email}</span>
              </div>
              <div className="flex justify-between font-poppins ">
                <span className="font-medium font-poppins ">Role:</span>
                <span>{selectedEmployee?.role}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-poppins "
            >
              Close
            </button>
          </div>
        </div>
        
      )}
       {deleteSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`px-6 py-4 rounded-lg shadow-lg text-2xl font-bold font-poppins  ${
            darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
            }`}  >
              Employee deleted successfully!
            </div>
          </div>
        )}
        {updateSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`px-6 py-4 rounded-lg shadow-lg text-2xl font-bold font-poppins ${
            darkMode ? "bg-white text-[#064979]" : "bg-gray-900 text-white"
            }`}  >
                     Employee Details Updated Successfully!
              </div>
              </div>
          )}

      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          darkMode={darkMode}
          onClose={() => setShowNotifications(false)}
        />
      )}

    </div>
    
  );
};

export default EmployeeStatusFood;