import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from '../../../Components/NavBar';
import Sidebar from "./Sidebar";
import moment from "moment"; // Import moment for date formatting

const ProfileHeadFood = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData ? userData.lastUpdate : null;
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData._id) {
          const response = await axios.get(`http://localhost:5005/api/auth/user/${userData._id}`);
          if (response.data.success) {
            setUser(response.data.user);
            setPhoneNumber(response.data.user.phone || "");
            setProfilePic(response.data.user.profilePic || "https://via.placeholder.com/100"); // Set profilePic from the response
            setLastUpdate(response.data.user.lastUpdate);
            localStorage.setItem("user", JSON.stringify({ ...userData, lastUpdate: response.data.user.lastUpdate, profilePic: response.data.user.profilePic })); // Update localStorage
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handlePhoneChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicFile(file); // Store the file object
      setProfilePic(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleRemoveProfilePic = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData._id) {
        console.error("User data not found in localStorage");
        return;
      }
  
      // Call the backend API to remove the profile picture
      const response = await axios.put(
        `http://localhost:5005/api/auth/removeProfilePic/${userData._id}`
      );
  
      if (response.data.success) {
        // Update local state
        setProfilePic("https://via.placeholder.com/100"); // Reset to default placeholder
        setProfilePicFile(null); // Clear the file object
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: null, // Remove profilePic from the user object
        }));
  
        // Update localStorage
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          profilePic: null, // Remove profilePic from localStorage
        }));
  
        alert("Profile picture removed successfully!");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      alert("Failed to remove profile picture.");
    }
  };

  const handleSave = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData._id) {
        console.error("User data not found in localStorage");
        return;
      }

      const currentDate = new Date().toISOString(); // Get current date in ISO format

      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("phone", phoneNumber);
      formData.append("lastUpdate", currentDate);

      if (profilePicFile) {
        // Append the file to the FormData object
        formData.append("profilePic", profilePicFile);
      }

      const response = await axios.put(
        `http://localhost:5005/api/auth/updateProfile/${userData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUser((prevUser) => ({
          ...prevUser,
          phone: phoneNumber,
          lastUpdate: currentDate,
          profilePic: response.data.user.profilePic, // Update profilePic from the response
        }));
        localStorage.setItem("user", JSON.stringify({
          ...userData,
          phone: phoneNumber,
          lastUpdate: currentDate,
          profilePic: response.data.user.profilePic, // Save profilePic in localStorage
        }));
        setLastUpdate(currentDate);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const formattedCreatedDate = moment(user.createdDate).format('YYYY-MM-DD');
  const formattedLastUpdate = lastUpdate ? moment(lastUpdate).format('YYYY-MM-DD') : "N/A";
  const lastUpdateAgo = lastUpdate ? moment(lastUpdate).fromNow() : "N/A";

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen flex flex-col`}>
      <Navbar />

      <div className="flex flex-grow">
        <Sidebar />

        <main className={`flex-grow p-8 ${darkMode ? "bg-gray-00" : "bg-white"} rounded-lg shadow-md`}>
          {/* Label & Dark Mode Toggle in One Row */}
          <div className="flex items-center justify-between mb-6 font-poppins">
            <label className={`text-2xl font-bold py-2 px-4 rounded-lg inline-block ${darkMode ? 'bg-teal-600 text-white' : 'bg-[#064979] text-white' } shadow-lg`}>
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
            <div className={`w-1/3 p-4 ${darkMode ? "bg-gray-700" : "bg-[#022847]"} rounded-lg shadow-md mr-6`}>
              <div className="flex flex-col items-center">
                <img
                  src={profilePic} // Use the profilePic state directly
                  alt="Profile"
                  className="rounded-full w-64 h-64 mb-4 object-cover"
                />
                <h2 className="text-3xl font-bold font-poppins text-white">{user.firstname} {user.lastname}</h2>

                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => document.getElementById("profilePicInput").click()}
                      className="mt-2 py-1 px-4 bg-blue-500 text-white rounded font-poppins"
                    >
                      Change
                    </button>
                    <button
                      onClick={handleRemoveProfilePic}
                      className="mt-2 py-1 px-4 bg-red-500 text-white rounded font-poppins"
                    >
                      Remove
                    </button>
                  </div>
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
            <div className={`w-1/2 p-4 ${darkMode ? "bg-gray-700" : "bg-[#022847]"} rounded-lg shadow-md ml-4`}>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold font-poppins ${darkMode ? "text-gray-300" : "text-white"}`}>First Name</label>
                  <p className="font-poppins text-gray-300">{user.firstname}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold ${darkMode ? "text-gray-300" : "text-white"}`}>Last Name</label>
                  <p className="font-poppins text-gray-300">{user.lastname}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold font-poppins ${darkMode ? "text-gray-300" : "text-white"}`}>Department</label>
                  <p className="font-poppins text-gray-300">{user.department}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold ${darkMode ? "text-gray-300" : "text-white"}`}>Employee ID</label>
                  <p className="font-poppins text-gray-300">{user.employeeid}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold ${darkMode ? "text-gray-300" : "text-white"}`}>Email</label>
                  <p className="font-poppins text-gray-300">{user.email}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold ${darkMode ? "text-gray-300" : "text-white"}`}>Position</label>
                  <p className="font-poppins text-gray-300">{user.position}</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className={`block text-lg font-bold ${darkMode ? "text-gray-300" : "text-white"}`}>Phone No</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="text-gray-900 border-2 border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    <p className="font-poppins text-gray-300">{phoneNumber}</p>
                  )}
                </div>

                {/* Edit Button */}
                <div className="flex flex-col items-start">
                  {isEditing ? (
                    <button onClick={handleSave} className="mt-4 py-1 px-4 bg-blue-500 text-white rounded font-poppins">
                      Save
                    </button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="mt-4 py-1 px-4 bg-green-500 text-white rounded font-poppins">
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Note About Account Creation */}
          <div className={`mt-8 ${darkMode ? "bg-gray-700 text-gray-300" : "bg-[#022847] text-black"} p-6 rounded-lg shadow-md`}>
            <h3 className="text-xl font-bold mb-4 underline font-poppins text-white">Account Information</h3>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2 text-white font-poppins" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14m7-7H5"></path>
                </svg>
                <p><strong>Created By:</strong> Admin</p>
              </div>

              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2 text-white font-poppins" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h18M3 14h18M3 18h18"></path>
                </svg>
                <p><strong>Created Date:</strong> {formattedCreatedDate}</p>
              </div>

              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2 text-white font-poppins" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79l-4.8-1.9m0 0L17 8l-7 7 5 5 6-7.21z"></path>
                </svg>
                <p><strong>Last Update:</strong> {formattedLastUpdate} ({lastUpdateAgo})</p>
              </div>

              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2 text-white font-poppins" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16m8-8H4"></path>
                </svg>
                <p><strong>Expiry Date:</strong> 2025-12-01</p>
              </div>

              <div className="flex items-center mb-2">
                <svg className="w-6 h-6 mr-2 text-white font-poppins" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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