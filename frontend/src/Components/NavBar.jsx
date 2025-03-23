import { Menu, Clock } from "lucide-react"; // Import Clock icon
import logo from "../../src/assets/logon.png";
import { useEffect, useState } from "react"; // Import useEffect and useState for the clock

export default function NavBar({ toggleSidebar }) {
  // State to store the current time
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update the clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Format the time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <nav className="flex items-center justify-between text-white p-4" style={{ backgroundColor: "#064979" }}>
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-3">
        <button className="text-white hover:text-gray-400" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <img src={logo} alt="Logo" className="w-10 h-10" />
        <span className="text-xl font-semibold text-blue-400">AuditFlow</span>
      </div>

      {/* Right Section - Real-Time Clock with Icon */}
      <div className="flex items-center gap-2">
        <Clock size={20} className="text-white" /> {/* Clock icon */}
        <span className="text-xl font-semibold">{formattedTime}</span> {/* Real-time clock */}
      </div>
    </nav>
  );
}