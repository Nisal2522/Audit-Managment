import React ,{useState } from 'react';

//Enter New
import { useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserPlus,
  FaUserCheck,
  FaCalendarAlt,
  FaUserCog,
  FaUserCircle,
  FaBullhorn,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //Enter New
  const handleLogout = () => {
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
   
    navigate('/');
  };


  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = userData.department === 'Admin' && userData.position === 'Admin';


  const ADMIN_PASSWORD = "admin@123";

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      window.location.href = "/Admin/Reset-Password";
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <aside className="w-64 text-white shadow-lg" style={{ backgroundColor: "#064979" }}>

       {/* Password Verification Modal */}
       {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-poppins">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Enter Admin Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border border-gray-300 rounded mb-2 text-black"
                placeholder="Enter admin password"
                required
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setError('');
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ul className="space-y-5 p-4">
        {isAdmin ? (
          /* ADMIN VIEW - SHOW DASHBOARD, CREATE ACCOUNT AND PROFILE */
          <>
            <li>
              <a
                href="/Admin"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaHome className="mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/Admin/create-account"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserPlus className="mr-2" />
                Create Account
              </a>
            </li>
            <li>
              <a
                href="/Admin/manage-accounts"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserCog className="mr-2" />
                Manage Accounts
              </a>
            </li>
            <li>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center w-full px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserPlus className="mr-2" />
                Reset Passwords
              </button>
            </li>
            <li>
              <a
                href="/Admin/profile"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserCircle className="mr-2" />
                Profile
              </a>
            </li>
          </>
        ) : (
          /* DEPARTMENT HEAD VIEW - SHOW FULL MENU */
          <>
            <li>
              <a
                href="/food/Head"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaHome className="mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Createaccount"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserPlus className="mr-2" />
                Create Account
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Employeestatus"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserCheck className="mr-2" />
                Employee Status
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Requestleave"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaCalendarAlt className="mr-2" />
                Request Leave
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Profile"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaUserCircle className="mr-2" />
                Profile
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Announcement"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaBullhorn className="mr-2" />
                Announcements
              </a>
            </li>
            <li>
              <a
                href="/food/Head/Reportview"
                className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
              >
                <FaFileAlt className="mr-2" />
                Report Review
              </a>
            </li>
          </>
        )}

        {/* COMMON LOGOUT OPTION FOR BOTH */}
        <li>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300 w-full text-left"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;