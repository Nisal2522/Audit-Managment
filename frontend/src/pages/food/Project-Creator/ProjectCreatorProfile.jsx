import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/SideBar";
import ProfilePic from "../../../assets/Project-Creator/profilePic.jpeg";
import { Cloudinary } from "@cloudinary/url-gen";

const ProfileHeadFood = () => {
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Initialize Cloudinary
    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dvhrmicc4' // Replace with your Cloudinary cloud name
        }
    });

    // Utility function to split the full name into firstName and lastName
    const splitName = (fullName) => {
        const parts = fullName.trim().split(" ");
        return parts.length === 1
            ? { firstName: parts[0], lastName: "" }
            : { firstName: parts[0], lastName: parts.slice(1).join(" ") };
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ProfilePicture'); // Replace with your upload preset

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/dvhrmicc4/image/upload`, // Replace with your cloud name
                formData
            );

            if (response.data.secure_url) {
                setProfilePic(response.data.secure_url);
                // Update the profile picture in the database
                try {
                    const userData = JSON.parse(localStorage.getItem("user"));
                    await axios.put(`http://localhost:5006/api/auth/user/${userData.userId}`, {
                        profilePic: response.data.secure_url
                    });
                } catch (error) {
                    console.error("Error updating profile picture:", error.response ? error.response.data : error);
                    alert("Failed to update profile picture in database: " + (error.response?.data?.message || error.message));
                }
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.userId) {
                    console.error("User ID is missing in localStorage. Redirecting to login...");
                    window.location.href = "/login";
                    return;
                }
                const response = await axios.get(`http://localhost:5006/api/auth/user/${userData.userId}`);
                console.log("API Response:", response.data);
                if (response.data.success && response.data?.user) {
                    const { name, ...rest } = response.data.user;
                    const { firstName, lastName } = splitName(name);
                    setUser({ ...rest, firstName, lastName });
                    setPhoneNumber(response.data.user.phone || "");
                    setProfilePic(response.data.user.profilePic || "https://via.placeholder.com/100");
                } else {
                    console.error("Invalid API response:", response.data);
                    alert("Failed to load user data. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert(`Failed to load user data: ${error.response?.data?.message || error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-black">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow p-8 ml-64 mt-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold text-[#022847]">User Profile</h1>
                    </div>

                    {/* Profile Section */}
                    <div className="flex gap-8">
                        {/* Left Column: Profile Picture and Name */}
                        <div className="w-1/3 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="rounded-full w-64 h-64 mb-4 object-cover border-4 border-[#022847] group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105"
                                    />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => document.getElementById("profilePicInput").click()}
                                                    className="py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                                                    disabled={uploading}
                                                >
                                                    {uploading ? 'Uploading...' : 'Change'}
                                                </button>
                                                <button
                                                    className="py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-300 transform hover:scale-105"
                                                    onClick={() => setProfilePic("https://via.placeholder.com/100")}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="profilePicInput"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: "none" }}
                                    />
                                </div>
                                <h2 className="text-3xl font-bold text-[#022847] mb-2">{user.firstName} {user.lastName}</h2>
                                <p className="text-gray-600 text-lg">{user.role}</p>
                            </div>
                        </div>

                        {/* Right Column: User Details */}
                        <div className="w-2/3 p-6 bg-[#022847] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="grid grid-cols-2 gap-8">
                                {/* First Name */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">First Name</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.firstName}</p>
                                </div>
                                {/* Last Name */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Last Name</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.lastName}</p>
                                </div>
                                {/* Department */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Department</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.department}</p>
                                </div>
                                {/* Employee ID */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Employee ID</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.employeeId}</p>
                                </div>
                                {/* Email */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Email</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.email}</p>
                                </div>
                                {/* Position */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Position</label>
                                    <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{user.role}</p>
                                </div>
                                {/* Phone Number */}
                                <div className="flex flex-col items-start group">
                                    <label className="block text-lg font-bold text-white mb-1">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            className="text-gray-900 border-2 border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:border-blue-500 transition duration-300"
                                        />
                                    ) : (
                                        <p className="text-gray-300 group-hover:text-white transition-colors duration-300">{phoneNumber}</p>
                                    )}
                                </div>
                                {/* Edit/Save Button */}
                                <div className="flex flex-col items-start">
                                    {isEditing ? (
                                        <button
                                            className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                                        >
                                            Save Changes
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 py-2 px-6 bg-[#2b5170] text-white rounded-lg font-medium hover:bg-[#1a3c5a] transition duration-300 transform hover:scale-105"
                                        >
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="mt-8 bg-[#022847] text-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <h3 className="text-2xl font-bold mb-6 underline decoration-blue-500 decoration-4">Account Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            <div className="flex items-center p-4 bg-[#1a3c5a] rounded-lg hover:bg-[#2b5170] transition-all duration-300">
                                <svg className="w-6 h-6 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m7-7H5"></path>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-400">Created By</p>
                                    <p className="font-medium">Department Head</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-[#1a3c5a] rounded-lg hover:bg-[#2b5170] transition-all duration-300">
                                <svg className="w-6 h-6 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 10h18M3 14h18M3 18h18"></path>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-400">Created Date</p>
                                    <p className="font-medium">{user.createdAt}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-[#1a3c5a] rounded-lg hover:bg-[#2b5170] transition-all duration-300">
                                <svg className="w-6 h-6 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79l-4.8-1.9m0 0L17 8l-7 7 5 5 6-7.21z"></path>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-400">Last Update</p>
                                    <p className="font-medium">23/03/2025 00:34:53</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-[#1a3c5a] rounded-lg hover:bg-[#2b5170] transition-all duration-300">
                                <svg className="w-6 h-6 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 4v16m8-8H4"></path>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-400">Expiry Date</p>
                                    <p className="font-medium">2025-12-01</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-[#1a3c5a] rounded-lg hover:bg-[#2b5170] transition-all duration-300">
                                <svg className="w-6 h-6 mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 9v6m0 4h0"></path>
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-400">Status</p>
                                    <p className="font-medium text-green-400">Active</p>
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