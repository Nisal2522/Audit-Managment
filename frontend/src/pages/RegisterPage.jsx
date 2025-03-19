import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerPhoto from '../assets/registerphoto.jpeg';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    department: '',
    position: 'Department Head',
    email: '',
    password: '',
    phone: '',
    employeeid: '', // This will be auto-generated
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to generate Employee ID
  const generateEmployeeId = (department) => {
    const departmentCodes = {
      Food: 'DHFO',
      Textile: 'DHTE',
      Organic: 'DHOR',
      Forest: 'DHFOR',
    };

    // Get the department code
    const departmentCode = departmentCodes[department] || 'DHEM'; // Default code if department is not found

    // Generate a random 4-digit number
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    

    // Combine everything to form the Employee ID
    return `${departmentCode}-${randomDigits}`;
  };

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Auto-generate Employee ID when department changes
      employeeid: name === 'department' ? generateEmployeeId(value) : prevData.employeeid,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5005/api/auth/register', formData);

      if (response.data.success) {
        alert('Registration Successful!');
        navigate('/login');
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
    <div className="register-page flex justify-center items-center h-screen overflow-hidden bg-white">
      {/* Left side for the image */}
      <div className="photo-container flex justify-center items-center flex-3 mr-10">
        <img src={registerPhoto} alt="Register" className="register-photo max-w-[100%] max-h-full rounded-lg object-cover" />
      </div>

      {/* Right side for the registration form */}
      <div className="form-container flex flex-col justify-center items-center flex-1 p-4 bg-white">
        <h2 className="text-3xl text-black mb-4 text-center font-semibold">Register</h2>
        {error && <p className="error-message text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-[320px]">
          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Firstname:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Lastname:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Select Department</option>
              <option value="Textile">Textile</option>
              <option value="Organic">Organic</option>
              <option value="Food">Food</option>
              <option value="Forest">Forest</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Position:</label>
            <input
              type="text"
              name="position"
              value="Department Head"
              readOnly
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Employee ID:</label>
            <input
              type="text"
              name="employeeid"
              value={formData.employeeid}
              readOnly
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1 text-blue-700 font-medium text-left">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 text-sm bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;