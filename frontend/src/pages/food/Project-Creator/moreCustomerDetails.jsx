import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Navbar from "../../../components/NavBar";
import Sidebar from "../../../components/SideBar";
import UnitTable from "./unitTable";


const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);

    // Fetch customer data on mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5006/api/customers/${id}`
                );
                const data = await response.json();
                setCustomer(data.data);
                setEditedCustomer(data.data);
            } catch (err) {
                setError("There was an error fetching the customer data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomerData();
    }, [id]);

    // Handle updating customer data
    const handleUpdateCustomer = async () => {
        try {
            const response = await fetch(
                `http://localhost:5006/api/customers/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedCustomer),
                }
            );
            const data = await response.json();
            if (response.ok) {
                alert("Customer data updated successfully.");
                setCustomer(data.data);
                setIsEditing(false);
            } else {
                setError("There was an error updating the customer data.");
            }
        } catch (err) {
            setError("There was an error updating the customer data.");
        }
    };

    // Handle input changes
    const handleInputChange = (field, value, nestedField = null) => {
        setEditedCustomer((prev) => {
            if (nestedField) {
                return {
                    ...prev,
                    [field]: {
                        ...prev[field],
                        [nestedField]: value,
                    },
                };
            }
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    // Handle canceling edit mode
    const handleCancelEdit = () => {
        setEditedCustomer(customer);
        setIsEditing(false);
    };

    // Handle sending email
    const handleSendEmail = () => {
        if (customer?.email?.mainEmail) {
            const email = customer.email.mainEmail;
            const subject = "Customer Inquiry";
            const body = "Dear Customer,\n\n";
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
                subject
            )}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        } else {
            alert("No main email address is available for this customer.");
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error)
        return <div className="text-center text-red-600 py-10">{error}</div>;

    return (
        <div className="min-h-screen ">
            {/* Fixed Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <div className="ml-64 mt-16">
                {/* Fixed Sidebar */}
                <Sidebar />
                <div className="min-h-screen mx-10">
                    <div className="container py-12">
                        {/* Card Container */}
                        <div className="bg-[#022847] shadow-lg rounded-lg p-8 space-y-8 w-full">

                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold text-white">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedCustomer.name}
                                            onChange={(e) =>
                                                handleInputChange("name", e.target.value)
                                            }
                                            className="w-full p-2 border rounded text-black"
                                        />
                                    ) : (
                                        <span className="text-4xl text-white  rounded-xl p-2 underline">{customer.name}</span>
                                    )}
                                </h2>
                                {/* Edit Button */}
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="p-3 rounded-md bg-green-600 text-white font-semibold hover:bg-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                ) : (
                                    <div className="space-x-4">
                                        <button
                                            onClick={handleUpdateCustomer}
                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Two-column Layout */}
                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-5">
                                    <div>
                                        <span className="font-medium text-white text-lg">ID: </span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCustomer._id}
                                                onChange={(e) =>
                                                    handleInputChange("_id", e.target.value)
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer._id}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white text-lg">Department:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCustomer.department}
                                                onChange={(e) =>
                                                    handleInputChange("department", e.target.value)
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.department}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white text-lg">Company Size:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCustomer.companySize}
                                                onChange={(e) =>
                                                    handleInputChange("companySize", e.target.value)
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.companySize}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <span className="font-medium text-white text-lg">Main Address:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCustomer.address?.mainAddress}
                                                onChange={(e) =>
                                                    handleInputChange("address", e.target.value, "mainAddress")
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.address?.mainAddress}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white text-lg">Invoice Address:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedCustomer.address?.invoiceAddress}
                                                onChange={(e) =>
                                                    handleInputChange("address", e.target.value, "invoiceAddress")
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.address?.invoiceAddress}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white text-lg">Main Email:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedCustomer.email?.mainEmail}
                                                onChange={(e) =>
                                                    handleInputChange("email", e.target.value, "mainEmail")
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.email?.mainEmail}</span>
                                        )}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white text-lg">Invoice Email:</span>{" "}
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedCustomer.email?.invoiceEmail}
                                                onChange={(e) =>
                                                    handleInputChange("email", e.target.value, "invoiceEmail")
                                                }
                                                className="w-full p-2 border rounded text-black"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">{customer.email?.invoiceEmail}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container text-2xl mb-5 font-bold text-[#022847]">Customer Facility Table</div>
                    <UnitTable />
                </div>
            </div>
        </div>

    );
};

export default CustomerDetails;