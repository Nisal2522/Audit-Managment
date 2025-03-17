//profile.jsx


import React, { useState, useEffect } from "react";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";

const ProfileHeadFood = () => {
  const [phoneNumber, setPhoneNumber] = useState("0705243589");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col`}>
      <Navbar />

      

      <div className="flex flex-grow">
        <Sidebar />

        <main className={`flex-grow p-8 ${darkMode ? "bg-gray-00" : "bg-white"} rounded-lg shadow-md`}>
         {/* Label & Dark Mode Toggle in One Row */}
          <div className="flex items-center justify-between mb-6">
          <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-slate-400 text-black'} shadow-lg`}>
              Profile
            </label>


            <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="px-4 py-2 text-xl font-semibold rounded-lg transition-all bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 text-white hover:scale-105 transform duration-200 ease-in-out"
                    >
                      {darkMode ? "☀️" : "🌙"}
            </button>

          </div>



          <div className="flex mt-8 ml-16">
            <div className={`w-1/3 p-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg shadow-md mr-6`}>
              <div className="flex flex-col items-center">
                <img
                  src={profilePicFile || profilePic}
                  alt="Profile"
                  className="rounded-full w-64 h-64 mb-4 object-cover"
                />
                <h2 className="text-3xl font-bold ">Nisal Amarasekara</h2>

                {isEditing && (
                  <button
                    onClick={() => document.getElementById("profilePicInput").click()}
                    className="mt-2 py-1 px-4 bg-blue-500 text-white rounded"
                  >
                    Change
                  </button>
                )}
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className={`w-1/2 p-4 ${darkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg shadow-md ml-4`}>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>First Name</label>
                  <p className="font-bold">Nisal</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>Last Name</label>
                  <p className="font-bold">Amarasekara</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>Department</label>
                  <p className="font-bold">Food</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>Email</label>
                  <p className="font-bold">nisalamarasekara@gmail.com</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>Position</label>
                  <p className="font-bold">Department Head</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-semibold ${darkMode ? "text-gray-300" : "text-blue-900"}`}>Phone No</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="text-gray-900 border-2 border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    <p className="font-bold">{phoneNumber}</p>
                  )}
                </div>

                {/* Edit Button */}
                <div className="flex flex-col items-start">
                  {isEditing ? (
                    <button onClick={handleSave} className="mt-4 py-1 px-4 bg-blue-500 text-white rounded">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="mt-4 py-1 px-4 bg-green-500 text-white rounded">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
           


           {/* Note About Account Creation */}
           <div className={`mt-8 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-black"} p-6 rounded-lg shadow-md`}>
              <h3 className="text-xl font-bold mb-4 underline ">Account Information</h3>

                    <div className="flex flex-wrap gap-8">

                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14m7-7H5"></path>
                        </svg>
                        <p><strong>Created By:</strong> Admin</p>
                      </div>


                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 10h18M3 14h18M3 18h18"></path>
                        </svg>
                        <p><strong>Created Date:</strong> 2023-12-01</p>
                      </div>


                      <div className="flex items-center mb-2">
                        <svg className="w-6 h-6 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 12.79l-4.8-1.9m0 0L17 8l-7 7 5 5 6-7.21z"></path>
                        </svg>
                        <p><strong>Last Update:</strong> 2025-03-15</p>
                      </div>


                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 mr-2 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v16m8-8H4"></path>
                  </svg>
                  <p><strong>Expiry Date:</strong> 2025-12-01</p>
                </div>


                <div className="flex items-center mb-2">
                  <svg className="w-6 h-6 mr-2 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v6m0 4h0"></path>
                  </svg>
                  <p><strong>Status:</strong> Active</p>
                </div>
              </div>
              </div>

        </main>
      </div>
    </div>
  );
};

export default ProfileHeadFood;
