import { LayoutDashboard, User, Settings, HelpCircleIcon, Bell, MessageCircleMore, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Notifications from "./Notifications"; // Import your Notifications component

export default function Sidebar() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [activeItem, setActiveItem] = useState(null);

    // Function to open the modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    return (
        <>
            {/* Sidebar */}
            <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#064979] to-[#0a5c8f] text-white w-64 p-6 z-40 shadow-xl">
                <nav className="space-y-4 mt-4">
                    <Link 
                        to="/projectCreator" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'dashboard' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('dashboard')}
                    >
                        <LayoutDashboard size={22} className="flex-shrink-0" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <button
                        onClick={() => {
                            openModal();
                            handleItemClick('notifications');
                        }}
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 w-full text-left ${
                            activeItem === 'notifications' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                        <Bell size={22} className="flex-shrink-0" />
                        <span className="font-medium">Notifications</span>
                    </button>

                    <Link 
                        to="/projectCreator/chatSystem" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'messages' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('messages')}
                    >
                        <MessageCircleMore size={22} className="flex-shrink-0" />
                        <span className="font-medium">Messages</span>
                    </Link>

                    <Link 
                        to="/projectCreator/profile" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'profile' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('profile')}
                    >
                        <User size={22} className="flex-shrink-0" />
                        <span className="font-medium">Profile</span>
                    </Link>

                    <Link 
                        to="/settings" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'settings' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('settings')}
                    >
                        <Settings size={22} className="flex-shrink-0" />
                        <span className="font-medium">Settings</span>
                    </Link>

                    <Link 
                        to="/help" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'help' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('help')}
                    >
                        <HelpCircleIcon size={22} className="flex-shrink-0" />
                        <span className="font-medium">Help</span>
                    </Link>

                    <Link 
                        to="/projectCreator/request-leave" 
                        className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                            activeItem === 'requestLeave' 
                            ? 'bg-white text-[#064979] shadow-md' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                        onClick={() => handleItemClick('requestLeave')}
                    >
                        <Calendar size={22} className="flex-shrink-0" />
                        <span className="font-medium">Request Leave</span>
                    </Link>
                </nav>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-[32rem] relative transform transition-all duration-300">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {/* Notifications Component */}
                        <Notifications />
                    </div>
                </div>
            )}
        </>
    );
} 