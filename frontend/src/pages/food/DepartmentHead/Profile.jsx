import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ProfileHeadFood = () => {
  const [phoneNumber, setPhoneNumber] = useState("0705243589");
  const [profilePic, setProfilePic] = useState("https://via.placeholder.com/100");
  const [profilePicFile, setProfilePicFile] = useState(null); // To hold the new image
  const [isEditing, setIsEditing] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-grow p-8 bg-white rounded-lg shadow-md">
          

        <label className="text-2xl font-semibold text-Blue1 bg-slate-300 py-2 px-4 rounded-lg inline-block mb-6">
            Profile
          </label>




          <div className="flex mt-8 ml-16">
            <div className="w-1/3 p-4 bg-gray-200 rounded-lg shadow-md mr-6">
              <div className="flex flex-col items-center">
                <img
                  src={profilePicFile || profilePic} // Use the uploaded image if available
                  alt="Profile"
                  className="rounded-full w-64 h-64 mb-4 object-cover"
                />
                <h2 className="text-3xl font-bold ">Dasindu Dinsara</h2>

                {isEditing && (
                  <button
                    onClick={() => document.getElementById('profilePicInput').click()} // Trigger file input
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
                  style={{ display: "none" }} // Hide the input
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="w-1/2 p-4 bg-gray-200 rounded-lg shadow-md  ml-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1 font-semibold">First Name</label>
                  <p className="text-gray-900 font-bold ">Dasindu</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1 font-semibold">Last Name</label>
                  <p className="text-gray-900 font-bold">Dinsara</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1  font-semibold">Department</label>
                  <p className="text-gray-900 font-bold ">Food</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1 font-semibold">Email</label>
                  <p className="text-gray-900 font-bold ">dinsaradasindu@gmail.com</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1 font-semibold">Position</label>
                  <p className="text-gray-900 font-bold ">Department Head</p>
                </div>

                <div className="flex flex-col items-start">
                  <label className="block text-gray-700 text-lg text-Blue1 font-semibold">Phone No</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="text-gray-900 border-2 border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    <p className="text-gray-900 font-bold ">{phoneNumber}</p>
                  )}
                </div>

                {/* Edit Button */}
                <div className="flex flex-col items-start">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="mt-4 py-1 px-4 bg-blue-500 text-white rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-4 py-1 px-4 bg-green-500 text-white rounded"
                    >
                      Edit 
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileHeadFood;
