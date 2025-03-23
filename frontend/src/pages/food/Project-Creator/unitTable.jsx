import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UnitTable = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control popup visibility
    const [selectedCertifications, setSelectedCertifications] = useState([]); // Selected certifications
    const [currentRowIndex, setCurrentRowIndex] = useState(null); // Index of the row being edited

    // Certifications list (can be fetched from an API or hardcoded)
    const availableCertifications = [
        "GRS NL",
        "RCS NL",
        "GOTS",
        "OEKO-TEX",
        "ISO 9001",
        "ISO 14001",
        "B Corp",
    ];

    // Fetch company details from the database on component mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(`http://localhost:5006/api/customers/${id}`);
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

    // Function to open the popup and set the current row index
    const openPopup = (index) => {
        setIsPopupOpen(true);
        setCurrentRowIndex(index);
    };

    // Function to close the popup
    const closePopup = () => {
        setIsPopupOpen(false);
        setCurrentRowIndex(null);
    };

    // Function to handle certification selection
    const handleCertificationSelection = (certification) => {
        if (selectedCertifications.includes(certification)) {
            setSelectedCertifications(selectedCertifications.filter((c) => c !== certification));
        } else {
            setSelectedCertifications([...selectedCertifications, certification]);
        }
    };

    // Function to save selected certifications to the corresponding row
    const saveCertifications = () => {
        setRows((prevRows) => {
            const updatedRows = [...prevRows];
            updatedRows[currentRowIndex].certifications = selectedCertifications;
            return updatedRows;
        });
        setSelectedCertifications([]); // Reset selected certifications
        closePopup(); // Close the popup
    };

    // Function to add a new row
    const handleAddRow = () => {
        setRows((prevRows) => [
            ...prevRows,
            {
                id: `New-${prevRows.length + 1}`,
                name: "New Company",
                certifications: [],
            },
        ]);
    };

    return (
        <div className="rounded-lg overflow-x-auto">
            {/* Table */}
            <table className="min-w-full bg-gray-100 border-collapse">
                {/* Table Header */}
                <thead>
                    <tr className="bg-[#022847] text-white text-center font-bold">
                        <th className="px-4 py-2 border ">Company Details</th>
                        <th className="px-4 py-2 border ">Warehousing</th>
                        <th className="px-4 py-2 border ">Extrusion</th>
                        <th className="px-4 py-2 border ">Collecting</th>
                        <th className="px-4 py-2 border ">Manufacturing</th>
                        <th className="px-4 py-2 border ">Trading</th>
                        <th className="px-4 py-2 border ">Mechanical Recycling</th>
                        <th className="px-4 py-2 border ">Printing</th>
                        <th className="px-4 py-2 border ">No Processing</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {/* Initial Row with Fetched Data */}
                    {customer && (
                        <tr>
                            <td className="px-4 py-2 border border-[#022947] align-top">
                                <p>
                                    {customer.name} (Hardcoded Risk Level)<br /><br />
                                    ID: {customer._id}<br /><br />
                                    Certifications:<br /> GRS NL / RCS NL<br />
                                    Main
                                </p>
                            </td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]">
                                RCS NL / RCS
                            </td>
                        </tr>
                    )}

                    {/* Dynamically Added Rows */}
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border border-gray-300 align-top">
                                <p>
                                    {row.name} (Hardcoded Risk Level)<br /><br />
                                    ID: {row.id}<br /><br />
                                    Certifications:<br /> {row.certifications.join(" / ") || "None"}<br />
                                    Main
                                    <button
                                        onClick={() => openPopup(index)}
                                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit Certifications
                                    </button>
                                </p>
                            </td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]"></td>
                            <td className="px-4 py-2 border border-[#022947]">
                                {row.certifications.join(" / ") || "None"}
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

            {/* Popup for Certification Selection */}
            {
                isPopupOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Select Certifications</h2>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {availableCertifications.map((certification, index) => (
                                    <label key={index} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedCertifications.includes(certification)}
                                            onChange={() => handleCertificationSelection(certification)}
                                            className="form-checkbox h-5 w-5 text-blue-500"
                                        />
                                        <span>{certification}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-end mt-4 space-x-2">
                                <button
                                    onClick={closePopup}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveCertifications}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default UnitTable;