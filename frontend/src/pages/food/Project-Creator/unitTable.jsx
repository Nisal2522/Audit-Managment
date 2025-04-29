import React, { useState } from "react";

const UnitTable = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        unitName: "",
        location: "",
        certifications: [],
        warehousing: [],
        extrusion: [],
        collecting: [],
        manufacturing: [],
        trading: [],
        mechanicalRecycling: [],
        printing: []
    });
    const [tableData, setTableData] = useState([]);

    const availableCertifications = [
        "GRS NL",
        "RCS NL",
        "GOTS",
        "OEKO-TEX",
        "ISO 9001",
        "ISO 14001",
        "B Corp"
    ];

    const processes = [
        "warehousing",
        "extrusion",
        "collecting",
        "manufacturing",
        "trading",
        "mechanicalRecycling",
        "printing"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCertificationChange = (process, certification) => {
        setFormData(prev => ({
            ...prev,
            [process]: prev[process].includes(certification)
                ? prev[process].filter(c => c !== certification)
                : [...prev[process], certification]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTableData(prev => [...prev, formData]);
        setIsFormOpen(false);
        setFormData({
            unitName: "",
            location: "",
            certifications: [],
            warehousing: [],
            extrusion: [],
            collecting: [],
            manufacturing: [],
            trading: [],
            mechanicalRecycling: [],
            printing: []
        });
    };

    return (
        <div className="rounded-lg overflow-x-auto shadow-lg bg-white p-6">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr className="bg-[#022847] text-white text-center font-bold">
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300">Unit Details</th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Warehousing
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Extrusion
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Collecting
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Manufacturing
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Trading
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Mechanical Recycling
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847] border-r border-gray-300 hover:bg-[#033a6b] transition-colors duration-200">
                            Printing
                        </th>
                        <th className="px-6 py-4 border-b-2 border-[#022847]">No Processing</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 border-b border-gray-200 border-r border-gray-300 align-top">
                                <div className="space-y-2">
                                    <p className="font-semibold text-gray-800">{row.unitName}</p>
                                    <p className="text-sm text-gray-600">Location: {row.location}</p>
                                </div>
                            </td>
                            {processes.map(process => (
                                <td key={process} className="px-6 py-4 border-b border-gray-200 border-r border-gray-300">
                                    <div className="flex flex-wrap gap-2">
                                        {row[process]?.map((certification, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {certification}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                            <td className="px-6 py-4 border-b border-gray-200">
                                <div className="flex flex-wrap gap-2">
                                    {row.certifications.map((certification, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {certification}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => setIsFormOpen(true)}
                    className="px-6 py-3 bg-[#022947] text-white font-semibold rounded-lg hover:bg-[#033a6b] transition-colors duration-200 text-xl shadow-md hover:shadow-lg"
                >
                    +
                </button>
            </div>

            {/* Form Popup */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Unit</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Unit Name
                                    </label>
                                    <input
                                        type="text"
                                        name="unitName"
                                        value={formData.unitName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800">Select Certifications for Each Process</h3>
                                {processes.map(process => (
                                    <div key={process} className="border rounded-lg p-4">
                                        <h4 className="text-md font-medium text-gray-700 mb-3 capitalize">{process}</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {availableCertifications.map((certification) => (
                                                <label key={certification} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData[process].includes(certification)}
                                                        onChange={() => handleCertificationChange(process, certification)}
                                                        className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-700">{certification}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                                >
                                    Add Unit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitTable;