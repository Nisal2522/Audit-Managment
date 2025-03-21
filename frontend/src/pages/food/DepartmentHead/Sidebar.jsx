import React from 'react';

const Sidebar = () => {
  return (
<aside className="w-64 text-white shadow-lg" style={{ backgroundColor: "#064979" }}>
<ul className="space-y-5 p-4">
        <li>
          <a
            href="/food/head"
            className="block px-4 py-2 rounded text-white  font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
            >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="/food/Head/Createaccount"
            className="block px-4 py-2 rounded text-white  font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Create Account
          </a>
        </li>
       
        <li>
          <a
            href="/food/Head/Employeestatus"
            className="block px-4 py-2 rounded text-white font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Employee Status
          </a>
        </li>
        <li>
          <a
            href="/food/Head/Requestleave"
            className="block px-4 py-2 rounded text-white  font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Request Leave
          </a>
        </li>
        <li>
          <a
            href="/food/Head/ProfileHeadFood"
            className="block px-4 py-2 rounded text-white  font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/food/Head/Announcement"
            className="block px-4 py-2 rounded text-white font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Announcements
          </a>
        </li>
        <li>
          <a
            href="/food/Head/Reportview"
            className="block px-4 py-2 rounded text-white font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Report Review
          </a>
        </li>
        <li>
          <a
            href="/login"
            className="block px-4 py-2 rounded text-white  font-bold hover:bg-white hover:text-black hover:font-bold transition duration-300"
          >
            Logout
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;