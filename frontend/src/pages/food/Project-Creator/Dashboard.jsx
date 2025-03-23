import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerDetails from "./customerDetails";
import Navbar from "../../../components/NavBar";
import AvatarGroup from "../../../components/AvatarGroup";
import Sidebar from "../../../components/SideBar";
import Clock from "../../../components/Clock.jsx";

const HomePage = () => {
    const [customers, setCustomers] = useState([]);
    const [activeProjects, setActiveProjects] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch customers data
                const customerResponse = await fetch("http://localhost:5006/api/customers");
                const customerData = await customerResponse.json();
                setCustomers(customerData.data);

                // Fetch active projects data (example endpoint)

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const status = "Active";
    const names = ["Nilina", "Charitha", "Manuga", ...Array(12).keys()];

    return (
        <div className="min-h-screen py-14 pl-14 flex flex-col">
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <div className="flex flex-1">
                {/* Fixed Sidebar */}
                <Sidebar />

                {/* Content with spacing to prevent overlapping */}
                <div className="flex-1 ml-64">
                    <div className="container mt-16">
                        <div className="container border-2 rounded-lg bg-[#022847] py-6">
                            <div className="flex items-center mb-2">
                                <h1 className="text-5xl pl-5 font-semibold text-white mr-4">
                                    Dashboard
                                </h1>
                                <div className="flex items-center ml-10 border-2 rounded-xl bg-[#ffffff19] border-green-500 px-2 py-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    <p className="text-xs font-semibold text-green-500">{status}</p>
                                </div>
                                <div className="pt-0">
                                    <div>
                                        <Clock />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-1">
                                <p className="text-3xl pl-5 poppins-regular text-gray-100">Hello, Nilina.</p>
                            </div>

                            <div className="mt-1 pl-5">
                                <AvatarGroup names={names} />
                            </div>
                        </div>
                        <CustomerDetails />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Total Customers Card */}
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Total Customers</h2>
                                <p className="text-4xl font-bold text-white mt-2">{customers.length}</p>
                            </div>

                            {/* Active Projects Card */}
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Active Projects</h2>
                                <p className="text-4xl font-bold text-white mt-2">{customers.length}</p>
                            </div>

                            {/* Revenue Card */}
                            <div className="bg-[#022847] shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-gray-300">Active Project Creators</h2>
                                <p className="text-4xl font-bold text-white mt-2">12</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default HomePage;