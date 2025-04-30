import { Search, Grid } from "lucide-react";
import logo from "../assets/Logo.png";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const [profilePic, setProfilePic] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (userData && userData.userId) {
                    const response = await axios.get(`http://localhost:5006/api/auth/user/${userData.userId}`);
                    if (response.data.success && response.data.user.profilePic) {
                        setProfilePic(response.data.user.profilePic);
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/projectCreator/profile");
        setIsDropdownOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-[#064979] text-white p-4 z-50">
            {/* Left Section - Logo & Title */}
            <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                <span className="text-xl font-semibold text-blue-400">AuditFlow</span>
            </div>

            {/* Right Section - Icons & Profile */}
            <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-400">
                    <Search size={20} />
                </button>
                <button className="text-white hover:text-gray-400">
                    <Grid size={20} />
                </button>
                <div className="relative" ref={dropdownRef}>
                    <img
                        src={profilePic || "https://via.placeholder.com/100"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                            <button
                                onClick={handleProfileClick}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}