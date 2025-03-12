import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerPhoto from '../assets/registerphoto.jpeg';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    department: '',
    position: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);

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
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full p-2 text-sm border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Select Position</option>
              <option value="Project Creator">Project Creator</option>
              <option value="Planner">Planner</option>
              <option value="Contractor">Contractor</option>
              <option value="Auditor">Auditor</option>
              <option value="Certifier">Certifier</option>
              <option value="Reviewer">Reviewer</option>
              <option value="Admin">Admin</option>
              <option value="Department Head">Department Head</option>
            </select>
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
