import React from 'react';
import {
  FaHome,
  FaUserPlus,
  FaUserCheck,
  FaCalendarAlt,
  FaUserCircle,
  FaBullhorn,
  FaFileAlt,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  return (
<aside className="w-64 text-white shadow-lg" style={{ backgroundColor: "#064979" }}>
<ul className="space-y-5 p-4">

          <li>
          <a
            href="/food/head"
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
            href="/food/Head/ProfileHeadFood"
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


         <li>
          <a
            href="/login"
            className="flex items-center px-4 py-2 rounded text-white font-poppins hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </a>
        </li>

      </ul>
    </aside>
  );
};

export default Sidebar;