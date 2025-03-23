import { LayoutDashboard, User, Settings, HelpCircleIcon, Bell, MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications"; // Import your Notifications component

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Sidebar */}
            <div className="fixed top-16 left-0 h-full bg-[#064979] text-white w-64 p-4 z-40">
                <nav className="space-y-5 mt-2">
                    <Link to="/projectCreator" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    {/* Notifications Link - Opens Modal */}
                    <button
                        onClick={openModal}
                        className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white w-full text-left"
                    >
                        <Bell size={20} />
                        <span>Notifications</span>
                    </button>
                    <Link to="/projectCreator/chatSystem" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
                        <MessageCircleMore size={20} />
                        <span>Messages</span>
                    </Link>
                    <Link to="/projectCreator/profile" className="flex bg-white text-black items-center space-x-3 p-2 hover:bg-[#5c97c876] rounded hover:text-white">
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            &times;
                        </button>
                        {/* Notifications Component */}
                        <Notifications />
                    </div>
                </div>
            )}
        </>
    );
} 