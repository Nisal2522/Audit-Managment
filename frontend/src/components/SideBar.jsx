import { Home, User, Settings, HelpCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="fixed top-16  left-0 h-full bg-[#064979] text-white w-64 p-4 z-40">
            <nav className="space-y-4">
                <Link to="/" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <Home size={20} />
                    <span>Home</span>
                </Link>
                <Link to="/profile" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <User size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/profile" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <User size={20} />
                    <span>Notifications</span>
                </Link>
                <Link to="/profile" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <User size={20} />
                    <span>Profile</span>
                </Link>
                <Link to="/settings" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
                <Link to="/settings" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                    <HelpCircleIcon size={20} />
                    <span>Help</span>
                </Link>
            </nav>
        </div>
    );
}