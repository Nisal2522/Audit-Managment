import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UnitTable = () => {
    // State to hold company details fetched from the database
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to manage additional rows in the table
    const [rows, setRows] = useState([]);

    // Fetch company details from the database on component mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5006/api/customers/${id}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch customer data.");
                }
                const data = await response.json();
                setCustomer(data.data); // Assuming the API returns an object with `id` and `name`
            } catch (err) {
                setError("There was an error fetching the customer data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    // Render loading state
    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div className="text-center text-red-600 py-10">{error}</div>;
    }

    // Function to add a new row
    const handleAddRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            {
                id: `New-${prevRows.length + 1}`,
                name: "New Company",
                certifications: ["GRS NL", "RCS NL"],
            },
        ]);
    };

    return (
        <div className="rounded-lg overflow-x-auto">
            <table className="min-w-full bg-gray-100 border-collapse ">
                {/* Table Header */}
                <thead>
                    <tr className="bg-[#022847] text-white text-center font-bold">
                        <th className="px-4 py-2 border border-gray-300">Company Details</th>
                        <th className="px-4 py-2 border border-gray-300">
                            Warehousing, distribution of non-final products (PR00031)
                        </th>
                        <th className="px-4 py-2 border border-gray-300">Extrusion (PR00010)</th>
                        <th className="px-4 py-2 border border-gray-300">Collecting (PR00005)</th>
                        <th className="px-4 py-2 border border-gray-300">Manufacturing (PR00016)</th>
                        <th className="px-4 py-2 border border-gray-300">Trading (PR00030)</th>
                        <th className="px-4 py-2 border border-gray-300">Mechanical recycling (PR00017)</th>
                        <th className="px-4 py-2 border border-gray-300">Printing (PR00023)</th>
                        <th className="px-4 py-2 border border-gray-300">No processing (PR00000)</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {/* Initial Row with Fetched Data */}
                    {customer && (
                        <tr>
                            {/* Company Details Column */}
                            <td className="px-4 py-2 border border-[#022947] align-top">
                                <p>
                                    {customer.name} (Hardcoded Risk Level)<br /><br />
                                    ID: {customer._id}<br /><br />
                                    Certifications:<br /> GRS NL / RCS NL<br />
                                    Main
                                </p>
                            </td>

                            {/* Other Columns (hardcoded for now) */}
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947] bg-blue-100">
                                RCS NL / RCS
                            </td>
                        </tr>
                    )}

                    {/* Dynamically Added Rows */}
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {/* Company Details Column */}
                            <td className="px-4 py-2 border border-gray-300 align-top">
                                <p>
                                    {row.name} (Hardcoded Risk Level)<br /><br />
                                    ID: {row.id}<br /><br />
                                    Certifications:<br /> {row.certifications.join(" / ")}<br />
                                    Main
                                </p>
                            </td>

                            {/* Other Columns (hardcoded for now) */}
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-gray-300"></td>
                            <td className="px-4 py-2 border border-gray-300"></td>
                            <td className="px-4 py-2 border border-gray-300"></td>
                            <td className="px-4 py-2 border border-gray-300"></td>
                            <td className="px-4 py-2 border border-gray-300"></td>
                            <td className="px-4 py-2 border border-gray-300 bg-blue-100">
                                RCS NL / RCS
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Row Button Container */}
            <div className="flex justify-center mt-1">
                <button
                    onClick={handleAddRow}
                    className="px-4 py-2 bg-[#022947] text-white font-semibold rounded-lg hover:bg-green-700 text-2xl"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default UnitTable;