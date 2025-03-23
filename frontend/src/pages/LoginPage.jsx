import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await axios.post('http://localhost:5005/api/auth/login', formData);
      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
        localStorage.setItem('token', token); // Store token in localStorage

        // Redirect based on department and position
        const redirectPaths = {
          Food: {
            'Department Head': '/food/Head',
          },
          Organic: {
            Reviewer: '/organic/Reviewer',
            Certifier: '/organic/Certifier',
            ProjectCreator: '/organic/ProjectCreator',
            Planner: '/organic/Planner',
            Contractor: '/organic/Contractor',
            Auditor: '/organic/Auditor',
          },
        };

        const redirectTo = redirectPaths[user.department]?.[user.position] || '/dashboard';
        navigate(redirectTo);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 font-poppins">
          Welcome to <span className="text-blue-400">AuditFlow</span>
        </h2>
        <p className="text-center text-gray-400 mb-6">Please log in to manage your audits efficiently.</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3  h-11 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full p-3 h-11 bg-gray-700 border border-gray-600 rounded-full  focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-blue-500 font-poppins h-11 rounded-full  text-white font-semibold hover:bg-blue-600 transition disabled:bg-gray-500"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="my-4 text-center text-gray-500 font-poppins ">or continue with</div>
        <button className="w-full flex  h-11 items-center justify-center p-3 border border-gray-600 rounded-full hover:bg-gray-700 transition">
          <FcGoogle className="text-xl mr-2 font-poppins" /> Google
        </button>
        <div className="text-right mb-4 font-poppins">
            <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>
        
        <div className="mt-4 flex items-center font-poppins">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember" className="text-gray-400 text-sm">Remember me</label>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;