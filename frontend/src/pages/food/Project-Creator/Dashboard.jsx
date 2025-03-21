import React from "react";
import { Link } from "react-router-dom";
import CustomerDetails from "./customerDetails";
import Navbar from "../../../components/NavBar";
import AvatarGroup from "../../../components/AvatarGroup";
import Sidebar from "../../../components/SideBar";

const HomePage = () => {
    const status = "Active";
    const names = ["Nilina", "Charitha", "Manuga", ...Array(12).keys()];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <div className="flex flex-1">
                {/* Fixed Sidebar */}
                <Sidebar />

                {/* Content with spacing to prevent overlapping */}
                <div className="flex-1 ml-64">
                    <div className="container  mt-16">
                        <div className="container border-2 rounded-lg bg-[#022847] py-8 mt-16">
                            <div className="flex  items-center mb-2">
                                <h1 className="text-5xl pl-5 font-extrabold text-white mr-4">
                                    Dashboard
                                </h1>
                                <div className="pt-3">
                                    <div className="flex items-center ml-10 border-2 rounded-xl bg-[#ffffff19] border-green-500 px-2 py-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <p className="text-xs font-semibold text-green-500">{status}</p>
                                    </div>
                                </div>
                            </div>

                            {/* New line for Project Creator */}
                            <div className="mt-4">
                                <p className="text-3xl pl-5 text-gray-100">Hello, Nilina.</p>
                            </div>

                            {/* New line for AvatarGroup */}
                            <div className="mt-4 pl-5">
                                <AvatarGroup names={names} />
                            </div>
                        </div>


                        {/* Avatar Group */}

                        {/* Customer Details Section */}
                        <CustomerDetails />

                        {/* Dashboard Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Total Customers</h2>
                                <p className="text-4xl font-bold text-white mt-2">150</p>
                            </div>
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Active Projects</h2>
                                <p className="text-4xl font-bold text-white mt-2">25</p>
                            </div>
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Revenue</h2>
                                <p className="text-4xl font-bold text-white mt-2">$12,340</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;