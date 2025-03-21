import { Search, Grid } from "lucide-react";
import logo from "../assets/Logo.png";
import avatar from "../assets/Project-Creator/avatar1.jpeg";


export default function NavBar() {
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
                <img
                    src={avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                />
            </div>
        </nav>
    );
}