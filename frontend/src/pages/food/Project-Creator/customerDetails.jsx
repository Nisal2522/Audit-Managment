import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const CreateCustomerDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch customer data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5006/api/customers");
                const data = await response.json();
                setCustomers(data.data);
                setFilteredCustomers(data.data); // Initialize filtered customers
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(query) ||
                customer.department?.toLowerCase().includes(query) ||
                customer.email?.mainEmail.toLowerCase().includes(query) ||
                customer.address?.mainAddress.toLowerCase().includes(query)
        );
        setFilteredCustomers(filtered);
    };

    // Handle delete customer
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
        );

        if (!confirmDelete) return;

        try {
            await fetch(`http://localhost:5006/api/customers/${id}`, {
                method: "DELETE",
            });

            // Remove the deleted customer
            setCustomers((prevCustomers) =>
                prevCustomers.filter((customer) => customer._id !== id)
            );
            setFilteredCustomers((prevFiltered) =>
                prevFiltered.filter((customer) => customer._id !== id)
            );
        } catch (err) {
            alert("Failed to delete customer: " + err.message);
        }
    };

    return (
        <div className="bg-[#02090D] min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Page Title */}
                {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Customer Management
                </h1> */}

                {/* Search Input */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by name, department, email, or address..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-[#02090D] text-white"
                    />
                </div>

                {/* Customer Table */}
                <div className="bg-[#02090D] shadow-lg rounded-lg p-6">
                    <h2 className="text-lg font-bold text-white mb-4">
                        All Customers
                    </h2>

                    {loading ? (
                        <p className="text-gray-500">Loading customers...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : filteredCustomers.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-[#02090D] text-blue-700">
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        ID
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        Company Name
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        Department
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        Main Email
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        Address
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-semibold text-white">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {filteredCustomers.map((customer, index) => (
                                        <motion.tr
                                            key={customer._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.5 }}
                                            className={`${index % 2 === 0 ? "bg-[#02090D]" : "bg-[#1A242F]"} `}
                                        >
                                            <Link
                                                to={`/CustomerDetails/${customer._id}`}
                                                className="contents"
                                            >
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer._id}
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer.name}
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer.department}
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer.email?.mainEmail}
                                                </td>
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer.address?.mainAddress}
                                                </td>
                                            </Link>
                                            <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(customer._id);
                                                    }}
                                                    className="border p-2 border-red-500 rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition-colors ml-4"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No customers found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateCustomerDashboard;
