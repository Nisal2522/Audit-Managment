import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import registerPhoto from '../assets/registerphoto.jpeg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5006/api/auth/login', formData);
      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem("user", JSON.stringify(user)); // Store user data in localStorage
        localStorage.setItem("token", token); // Store token in localStorage
        window.location.href = "/projectCreator"; // Redirect to the dashboard
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
    <div className="register-page flex justify-center items-center h-screen overflow-hidden bg-white">
      {/* Left side for the image */}
      <div className="photo-container flex justify-center items-center flex-4 mr-44">
        <img src={registerPhoto} alt="Register" className="register-photo max-w-[125%] max-h-full rounded-lg object-cover" />
      </div>

      {/* Right side for the login form */}
      <div className="form-container flex flex-col justify-center items-center flex-1 p-5 bg-white mr-10">
        <h2 className="text-2xl text-black mb-5 text-center font-semibold">Login</h2>
        {error && <p className="error-message text-red-500 text-base mb-5 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
          <div className="mb-4">
            <label className="block text-lg mb-2 text-blue-700 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-[350px] p-3 text-base border border-gray-300 rounded-lg bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg mb-2 text-blue-700 font-semibold">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-[350px] p-3 text-base border border-gray-300 rounded-lg bg-gray-100 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-blue-500 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="w-full p-3 text-lg bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;