import { Menu, Search, Grid } from "lucide-react";
import logo from "../assets/auditflow01.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import profile from "../assets/profile.png";
import { useState, useEffect } from "react";

export default function NavBar({ toggleSidebar }) {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const [time, setTime] = useState(""); // State to store the current time

  // Function to handle profile icon click
  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  // Function to update the time
  const updateTime = () => {
    const currentTime = new Date().toLocaleTimeString(); // Get current time
    setTime(currentTime); // Update the state with the current time
  };

  // Update the time every second
  useEffect(() => {
    const intervalId = setInterval(updateTime, 1000); // Update every second

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className="flex items-center justify-between bg-[#022847] text-white p-4">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar} // Call the toggleSidebar function when clicked
          className="text-white hover:text-gray-400 mt-1"
        >
          <Menu size={24} />
        </button>
        <img src={logo} alt="Logo" className="w-9 h-9 z-50 ml-3" />
        <span className="text-xl font-semibold text-blue-400 z-50">AuditFlow</span>
      </div>

      {/* Center Section - Real-Time Clock */}
      <div className="text-white text-lg font-semibold">
        {time} {/* Display the current time in the center */}
      </div>

      {/* Right Section - Icons & Profile */}
      <div className="flex items-center gap-4">
        <img
          onClick={handleProfileClick} // Call handleProfileClick when clicked
          src={profile}
          alt="Profile"
          className="w-8 h-8 rounded-full cursor-pointer"
        />
      </div>
    </nav>
  );
}