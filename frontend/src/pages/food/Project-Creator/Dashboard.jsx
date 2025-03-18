import React from "react";
import { Link } from "react-router-dom";
// import Calendar from "../components/Calendar";
import CustomerDetails from "./customerDetails";

const HomePage = () => {
    return (
        <div className="bg-[#02090D] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-extrabold text-white mb-6">
                    Dashboard Overview
                    <p className="text-lg pt-1 text-gray-400">Project Creator</p>
                </h1>
                <CustomerDetails />
            </div>
            {/* Overview Cards */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#02090D] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Total Customers
                        </h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">150</p>
                    </div>
                    <div className="bg-[#02090D] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Active Projects
                        </h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">25</p>
                    </div>
                    <div className="bg-[#02090D] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                        <p className="text-4xl font-bold text-gray-800 mt-2">$12,340</p>
                    </div>
                    {/* <Calendar /> */}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
