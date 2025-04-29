import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import logo from "../../../assets/Logo.png"

const CreateCustomerDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("dateCreated"); // Sort by A to Z or Date Created

    // Fetch customer data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5006/api/customers");
                const data = await response.json();
                setCustomers(data.data);
                setFilteredCustomers(data.data); // Initialize filtered customers with all data
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

    // Handle sorting
    useEffect(() => {
        let sorted = [...filteredCustomers];
        if (sortBy === "aToZ") {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "dateCreated") {
            sorted.sort(
                (a, b) =>
                    new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
            );
        }
        setFilteredCustomers(sorted);
    }, [sortBy, customers]); // Only re-sort when sortBy or customers changes

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

            // Add Logo (Replace 'logo.png' with the path to your logo image)

            const logoImg = new Image();
            logoImg.src = logo;
            //  // Update this path to your logo file
            doc.addImage(logoImg, "PNG", 15, 10, 30, 10);
            // // x, y, width, height

            // Add Title and Date
            const title = "Customer List Report";
            const date = new Date().toLocaleDateString(); // Get current date
            doc.setFontSize(18);
            doc.setTextColor("#022847"); // Set text color to match your theme
            doc.text(title, 14, 30); // Position the title
            doc.setFontSize(12);
            doc.setTextColor("#6B7280"); // Lighter text color for the date
            doc.text(`Report Generated on: ${date}`, 14, 36); // Position the date

            // Define table columns
            const tableColumns = [
                "Customer No",
                "ID",
                "Company Name",
                "Department",
                "Main Email",
                "Address",
            ];
            const tableRows = [];

            // Populate table rows with customer data
            customers.forEach((customer) => {
                const customerData = [
                    customer.cuNo || "",
                    customer._id,
                    customer.name,
                    customer.department || "",
                    customer.email?.mainEmail || "",
                    customer.address?.mainAddress || "",
                ];
                tableRows.push(customerData);
            });

            // Generate the table using autoTable
            doc.autoTable(tableColumns, tableRows, { startY: 45 }); // Adjust startY to leave space for the logo and title

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
                <h1 className="text-3xl font-bold text-[#022847] mb-6 flex justify-between items-center">
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
                        {/* <button
                            onClick={handleExport}
                            className="bg-blue-500 text-base hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Export CSV
                        </button> */}
                        <button
                            onClick={handleExportPDF}
                            className="bg-[#2741c2] text-base hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Export PDF
                        </button>
                    </div>
                </h1>



                {/* Search Input */}
                <div className="bg-[#022847] shadow-lg rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative ">
                            {/* Search Icon */}
                            <button
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400"
                                style={{ pointerEvents: "none" }} // Disable button interaction
                            >
                                <Search size={20} />
                            </button>
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="Search customers"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="p-3 pl-12 rounded-lg bg-[#022847] text-white w-full"
                            />
                        </div>
                        {/* Sort Dropdown */}
                        <div className="flex gap-4 mb-4">
                            <div className="relative w-full">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-sm transition duration-300 ease-in-out"
                                >
                                    <option value="dateCreated">Sort by Date Created</option>
                                    <option value="aToZ">Sort A to Z</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                                    <svg
                                        className="fill-current h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2 className="text-2xl pt-5 font-bold text-white mb-4">
                        All Customers
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
                                        Customer No
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
                                            className={`${index % 2 === 0 ? "bg-[#022847]" : "bg-[#022847]"
                                                } `}
                                        >
                                            <Link
                                                to={`/projectCreator/${customer._id}`}
                                                className="contents"
                                            >
                                                <td className="border-b border-gray-200 px-4 py-3 text-sm text-white">
                                                    {customer.cuNo}
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