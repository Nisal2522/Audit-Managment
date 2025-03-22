import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
// import AutoTable from 'jsautotable';


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
                setFilteredCustomers(data.data);
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

    // Handle export functionality
    const handleExport = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            [
                ["ID", "Company Name", "Department", "Main Email", "Address"].join(","),
                ...customers.map((customer) =>
                    [
                        customer._id,
                        customer.name,
                        customer.department || "",
                        customer.email?.mainEmail || "",
                        customer.address?.mainAddress || "",
                    ].join(",")
                ),
            ]
                .join("\n")
                .replace(/(^\[)|(\]$)/gm, "");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "customers.csv");
        document.body.appendChild(link);
        link.click();
    };

    const handleExportPDF = async () => {
        try {
            // Dynamically import jspdf and jspdf-autotable
            const { default: jsPDF } = await import("jspdf");
            await import("jspdf-autotable");

            // Initialize the PDF document
            const doc = new jsPDF();

            // Define table columns
            const tableColumns = ["ID", "Company Name", "Department", "Main Email", "Address"];
            const tableRows = [];

            // Populate table rows with customer data
            customers.forEach((customer) => {
                const customerData = [
                    customer._id,
                    customer.name,
                    customer.department || "",
                    customer.email?.mainEmail || "",
                    customer.address?.mainAddress || "",
                ];
                tableRows.push(customerData);
            });

            // Add a title to the PDF
            doc.text("Customer List", 14, 15);

            // Generate the table using autoTable
            doc.autoTable(tableColumns, tableRows, { startY: 20 });

            // Save the PDF
            doc.save("customers.pdf");
        } catch (error) {
            console.error("Error exporting PDF:", error.message);
            alert("Failed to export PDF. Please try again.");
        }
    };

    return (
        <div className="bg-white">
            <div className="container py-8">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex justify-between items-center">
                    <span>Customer Management</span>
                    {/* Buttons Container */}
                    <div className="flex gap-4">
                        {/* Add Customer Button */}
                        <Link
                            to="/projectCreator/addCustomer"
                            className="bg-[#022847] text-base hover:bg-[#0228476a] text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            + Add Customer
                        </Link>
                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            className="bg-blue-500 text-base hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="bg-blue-500 text-base hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Export PDF
                        </button>
                    </div>
                </h1>

                {/* Search Input */}
                <div className="bg-[#022847] shadow-lg rounded-lg p-6">
                    <div className="relative w-full">
                        {/* Search Icon */}
                        <button
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400"
                            style={{ pointerEvents: 'none' }} // Disable button interaction
                        >
                            <Search size={20} />
                        </button>

                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search by name, department, email, or address..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-3 pl-12 rounded-lg bg-[#022847] text-white w-full"
                        />
                    </div>

                    <h2 className="text-2xl pt-5 font-bold text-white mb-4">
                        All Customers / Projects
                    </h2>

                    {loading ? (
                        <p className="text-gray-500">Loading customers...</p>
                    ) : error ? (
                        <p className="text-red-500">Error: {error}</p>
                    ) : filteredCustomers.length > 0 ? (
                        <table className="min-w-full table-auto border-collapse border border-gray-200 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-[#02090d59] text-blue-700">
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
                                        ID
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
                                        Company Name
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
                                        Department
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
                                        Main Email
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
                                        Address
                                    </th>
                                    <th className="border-b border-gray-300 px-4 py-2 text-left text-base font-semibold text-white">
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
                                            className={`${index % 2 === 0 ? "bg-[#022847]" : "bg-[#022847]"} `}
                                        >
                                            <Link
                                                to={`/projectCreator/${customer._id}`}
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
                                                    className="border p-2 border-blue-400 rounded-lg text-blue-400 hover:text-white hover:bg-red-500 transition-colors ml-4"
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