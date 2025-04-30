import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerDetails from "./customerDetails";
import Navbar from "../../../components/NavBar";
import AvatarGroup from "../../../components/AvatarGroup";
import Sidebar from "../../../components/SideBar";

const HomePage = () => {
    const [customers, setCustomers] = useState([]);
    const [activeProjects, setActiveProjects] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const customerResponse = await fetch("http://localhost:5006/api/customers");
                const customerData = await customerResponse.json();
                setCustomers(customerData.data);
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

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white py-14 pl-14 flex flex-col">
            <Navbar />

            <div className="flex flex-1">
                <Sidebar />

                <div className="flex-1 ml-64">
                    <div className="container mt-16 px-6">
                        {/* Header Section */}
                        <div className="container rounded-2xl bg-gradient-to-r from-[#022847] to-[#011c33] py-8 shadow-lg transform transition-all duration-300 hover:scale-[1.01]">
                            <div className="flex items-center justify-between mb-4 px-6">
                                <div className="flex items-center space-x-6">
                                    <h1 className="text-5xl font-bold text-white tracking-tight">
                                        Dashboard
                                    </h1>
                                    <div className="flex items-center space-x-2 bg-[#ffffff19] border border-green-500 rounded-xl px-4 py-2 backdrop-blur-sm">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-medium text-green-500">{status}</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-end">
                                    <div className="text-white text-xl font-medium">
                                        {formatTime(currentTime)}
                                    </div>
                                    <div className="text-white/80 text-sm mt-1">
                                        {formatDate(currentTime)}
                                    </div>
                                </div>
                            </div>

                            <div className="px-6">
                                <p className="text-3xl text-gray-100 font-light">Hello, <span className="font-semibold">Nilina</span>.</p>
                                <div className="mt-4">
                                    <AvatarGroup names={names} />
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                            <div className="bg-gradient-to-r from-[#022847] to-[#011c33] rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-300">Total Customers</h2>
                                    <div className="w-10 h-10 bg-[#ffffff19] rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-white mt-4">{customers.length}</p>
                            </div>

                            <div className="bg-gradient-to-r from-[#022847] to-[#011c33] rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-300">Active Projects</h2>
                                    <div className="w-10 h-10 bg-[#ffffff19] rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-white mt-4">{customers.length}</p>
                            </div>

                            <div className="bg-gradient-to-r from-[#022847] to-[#011c33] rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-300">Active Project Creators</h2>
                                    <div className="w-10 h-10 bg-[#ffffff19] rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-4xl font-bold text-white mt-4">12</p>
                            </div>
                        </div>

                        <CustomerDetails />
                    </div>
                </div>
            </div>
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            {error && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    Error: {error}
                </div>
            )}
        </div>
    );
};

export default HomePage;