import React, { useState } from 'react';
import logo from '../../assets/logon.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import Navbar from "../../components/NavBar";
import Sidebar from '../../components/Sidebar';

const Systemadmincreateaccount = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    department: '',
    position: 'Department Head',
    email: '',
    password: '',
    phone: '',
    employeeid: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if ((name === 'firstname' || name === 'lastname') && /[0-9]/.test(value)) {
      return;
    }

    if (name === 'phone') {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      employeeid: name === 'department' ? generateEmployeeId(value) : prevData.employeeid,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form Submitted', formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateEmployeeId = (department) => {
    const departmentCodes = {
      Food: 'DHFO',
      Textile: 'DHTE',
      Organic: 'DHOR',
      Forest: 'DHFOR',
    };
    const departmentCode = departmentCodes[department] || 'DHEM'; 
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${departmentCode}-${randomDigits}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5005/api/auth/register', formData);
      if (response.data.success) {
        alert('Registration Successful!');
        navigate('/Admin');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error details:', err.response || err.message);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
      
      <div className=" flex ">
        {/* Sidebar */}
        {!isSidebarVisible && (
          <div className=" flex w-64"> {/* Increased width from default */}
            <Sidebar />
          </div>
        )}
        
        <div className="min-h-screen bg-gray-900 flex items-start justify-start p-4 w-full">
          {/* Card in the top-left corner */}
          <div 
            className="bg-white w-[450px] h-[630px] rounded-tl-3xl rounded-tr-3xl shadow-lg p-6 ml-[130px] mt-4"  
            style={{
              background: 'linear-gradient(to bottom, #2596be, #1078ad,#054783, #0a2f5c)',
            }}
          >  
            <div className="bg-black p-2 w-[100px] h-9 ml-[140px] rounded-full mb-4 flex items-center justify-center"></div>
            
            <div className="flex items-center justify-center mb-4 mt-[210px] ml-[-20px]">
              <img src={logo} alt="Logo" className="w-10 h-auto mr-0" />
              <h2 className="text-1xl font-semibold text-white font-poppins">AUDITFLOW</h2>
            </div>
            <div className="text-center text-white mt-6">
              <h3 className="text-xl font-medium font-poppins">Register Department Heads</h3>
              <p className="text-sm text-gray-200 mt-2 font-poppins">
                Only administrators can create department head accounts. Please proceed with registration.
              </p>
            </div>

            <div className="text-center mt-10 font-poppins">
              <button className="bg-gray-800 text-white w-full p-3 rounded mb-2 cursor-pointer hover:bg-gray-600">
                1. Enter Department Head Details
              </button>
              <button className="bg-gray-800 text-white w-full p-3 rounded mb-2 cursor-pointer hover:bg-gray-600">
                2. Assign Department & Permissions
              </button>
              <button className="bg-gray-800 text-white w-full p-3 rounded cursor-pointer hover:bg-gray-600">
                3. Confirm & Create Account
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-gray-900 w-[550px] h-[650px] rounded-tl-3xl rounded-tr-3xl shadow-lg p-6 ml-[40px] mt-4">
            <div className="text-center text-white mt-4">
              <h3 className="text-2xl font-medium font-poppins">Sign Up Account</h3>
              <p className="text-sm text-gray-200 mt-2 font-poppins">
                Please fill in the necessary information for the department head registration.
              </p>
              <div className="flex justify-center space-x-4 mt-8"></div>
            </div>
            {error && <p className="error-message text-red-500 text-sm mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="w-full max-w-[320px] ml-[110px] mt-6">
              {/* Step 1: First four inputs */}
              {currentStep === 1 && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-medium font-poppins text-left">Firstname:</label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={(e) => handleChange(e)}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-medium font-poppins text-left">Lastname:</label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={(e) => handleChange(e)}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-medium font-poppins text-left">Department:</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="">Select Department</option>
                      <option value="Textile">Textile</option>
                      <option value="Organic">Organic</option>
                      <option value="Food">Food</option>
                      <option value="Forest">Forest</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-medium font-poppins text-left">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      !formData.firstname || !formData.lastname || !formData.department || !formData.email
                    }
                    className={`w-full p-2 text-lg ${
                      formData.firstname && formData.lastname && formData.department && formData.email 
                        ? 'bg-blue-500 hover:bg-blue-700' 
                        : 'bg-gray-900 cursor-not-allowed'
                    } text-white rounded-md transition-all mt-8`}
                  >
                    Next
                  </button>
                </>
              )}

              {/* Step 2: Next set of inputs */}
              {currentStep === 2 && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-poppins font-medium text-left">Phone Number:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-poppins font-medium text-left">Employee ID:</label>
                    <input
                      type="text"
                      name="employeeid"
                      value={formData.employeeid}
                      readOnly
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-poppins font-medium text-left">Position:</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      readOnly
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm mb-1 text-white font-poppins font-medium text-left">Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full p-2 text-lg font-semibold font-poppins border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="text-center mt-8 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 p-2 text-lg bg-gray-500 font-poppins text-white rounded-md cursor-pointer hover:bg-gray-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={currentStep === 1}
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/3 p-2 text-lg bg-blue-500 font-poppins text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Systemadmincreateaccount;