import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/SideBar";
import ProfilePic from "../../../assets/Project-Creator/profilePic.jpeg";

const ProfileHeadFood = () => {
    const [user, setUser] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Utility function to split the full name into firstName and lastName
    const splitName = (fullName) => {
        const parts = fullName.trim().split(" ");
        return parts.length === 1
            ? { firstName: parts[0], lastName: "" }
            : { firstName: parts[0], lastName: parts.slice(1).join(" ") };
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.userId) {
                    console.error("User ID is missing in localStorage. Redirecting to login...");
                    window.location.href = "/login"; // Redirect to login page
                    return;
                }
                const response = await axios.get(`http://localhost:5006/api/auth/user/${userData.userId}`);
                console.log("API Response:", response.data);
                if (response.data.success && response.data?.user) {
                    const { name, ...rest } = response.data.user; // Extract the 'name' field
                    const { firstName, lastName } = splitName(name); // Split the name
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
        <div className="bg-white min-h-screen text-black">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <main className="flex-grow p-8 ml-64 mt-20 bg-white rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-[#022847] underline">User Profile</h1>
                    </div>

                    {/* Profile Section */}
                    <div className="flex mt-8">
                        {/* Left Column: Profile Picture and Name */}
                        <div className="w-1/3 p-4 bg-white rounded-lg shadow-md mr-6">
                            <div className="flex flex-col items-center">
                                <img
                                    src={ProfilePic}
                                    alt="Profile"
                                    className="rounded-full w-64 h-64 mb-4 object-cover border-4 border-[#022847] hover:border-blue-500 transition duration-300"
                                />
                                <h2 className="text-3xl font-bold text-[#022847]">{user.firstName} {user.lastName}</h2>
                                {isEditing && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => document.getElementById("profilePicInput").click()}
                                            className="py-1 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition duration-300"
                                        >
                                            Change
                                        </button>
                                        <button
                                            className="py-1 px-4 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition duration-300"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="profilePicInput"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                />
                            </div>
                        </div>

                        {/* Right Column: User Details */}
                        <div className="w-1/2 p-4 bg-[#022847] rounded-lg shadow-md">
                            <div className="grid grid-cols-2 gap-8">
                                {/* First Name */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">First Name:</label>
                                    <p className="text-gray-300">{user.firstName}</p>
                                </div>
                                {/* Last Name */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Last Name:</label>
                                    <p className="text-gray-300">{user.lastName}</p>
                                </div>
                                {/* Department */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Department:</label>
                                    <p className="text-gray-300">{user.department}</p>
                                </div>
                                {/* Employee ID */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Employee ID:</label>
                                    <p className="text-gray-300">{user.employeeId}</p>
                                </div>
                                {/* Email */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Email:</label>
                                    <p className="text-gray-300">{user.email}</p>
                                </div>
                                {/* Position */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Position:</label>
                                    <p className="text-gray-300">{user.role}</p>
                                </div>
                                {/* Phone Number */}
                                <div className="flex flex-col items-start">
                                    <label className="block text-lg font-bold text-white">Phone Number:</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            className="text-gray-900 border-2 border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500 transition duration-300"
                                        />
                                    ) : (
                                        <p className="text-gray-300">{phoneNumber}</p>
                                    )}
                                </div>
                                {/* Edit/Save Button */}
                                <div className="flex flex-col items-start">
                                    {isEditing ? (
                                        <button
                                            className="mt-4 py-1 px-4 bg-blue-500 text-white rounded font-medium hover:bg-blue-600 transition duration-300"
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 py-1 px-4 bg-[#2b5170] text-white rounded font-medium hover:bg-[#1a3c5a] transition duration-300"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="mt-8 bg-[#022847] text-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4 underline">Account Information</h3>
                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 5v14m7-7H5"></path>
                                </svg>
                                <p><strong>Created By:</strong> Department Head</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 10h18M3 14h18M3 18h18"></path>
                                </svg>
                                <p><strong>Created Date:</strong> {user.createdAt}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79l-4.8-1.9m0 0L17 8l-7 7 5 5 6-7.21z"></path>
                                </svg>
                                <p><strong>Last Update:</strong> 23/03/2025 00:34:53</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 4v16m8-8H4"></path>
                                </svg>
                                <p><strong>Expiry Date:</strong> 2025-12-01</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <svg className="w-6 h-6 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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