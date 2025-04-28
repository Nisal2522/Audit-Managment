// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FaLock, FaExclamationTriangle } from 'react-icons/fa';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  // Check if token exists
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Check if user data is valid
  if (!user.department || !user.position) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Access control rules
  const accessRules = {
    Food: {
      'Department Head': [
        '/food/Head',
        '/food/Head/Createaccount',
        '/food/Head/Employeestatus',
        '/food/Head/Requestleave',
        '/food/Head/Profile',
        '/food/Head/Announcement',
        '/food/Head/Reportview'
      ],

      
    },
    Admin: {
      Admin: [
        '/Admin',
        '/Admin/profile',
        '/Admin/create-account',
        '/Admin/Reset-Password',
        '/Admin/manage-accounts'
      ],
    },
   
  };

  const userDepartment = user.department;
  const userPosition = user.position;
  const userPaths = accessRules[userDepartment]?.[userPosition] || [];

  // Check if current path is allowed
  const isPathAllowed = userPaths.some(path => 
    location.pathname.startsWith(path)
  );

  if (!isPathAllowed) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4 flex justify-center">
            <FaLock />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <div className="text-yellow-500 text-lg mb-4 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            You don't have permission to access this page
          </div>
          <p className="text-gray-300 mb-6">
            Please contact your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;