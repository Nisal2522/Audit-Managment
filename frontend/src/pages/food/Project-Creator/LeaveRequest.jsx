import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaFileAlt, FaTimes, FaPaperPlane } from 'react-icons/fa';

const LeaveRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Add API call to submit leave request
      console.log('Leave request submitted:', formData);
      // Show success message
      alert('Leave request submitted successfully!');
      // Navigate back to dashboard
      navigate('/projectCreator');
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaFileAlt className="mr-3 text-blue-600" />
              Request Leave
            </h2>
            <button
              onClick={() => navigate('/projectCreator')}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <label htmlFor="leaveType" className="block text-sm font-semibold text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select leave type</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="bg-gray-50 p-6 rounded-xl">
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Leave
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Please provide a detailed reason for your leave request..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/projectCreator')}
                className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center"
              >
                <FaPaperPlane className="mr-2" />
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest; 