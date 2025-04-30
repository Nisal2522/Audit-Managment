// C:\Users\Dasindu\OneDrive\Desktop\all3\New folder\frontend\src\pages\Requestleave.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from "../components/NavBar";
import SideBar from '../components/SideBar';

const RequestLeaveForm = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        leaveCategory: '',
        startDate: '',
        endDate: '',
        reason: '',
        document: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [leaveRequests, setLeaveRequests] = useState([]);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("user"));
                if (!userData || !userData.userId) {
                    console.error("User ID is missing in localStorage. Redirecting to login...");
                    window.location.href = "/";
                    return;
                }

                if (userData.employeeId) {
                    setFormData(prev => ({
                        ...prev,
                        employeeId: userData.employeeId
                    }));
                    await fetchLeaveRequests(userData.employeeId);
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://localhost:5006/api/auth/user/${userData.userId}`);

                if (response.data.success && response.data?.user) {
                    setFormData(prev => ({
                        ...prev,
                        employeeId: response.data.user.employeeId || ''
                    }));
                    await fetchLeaveRequests(response.data.user.employeeId);
                } else {
                    console.error("Invalid API response:", response.data);
                    alert("Failed to load user data. Please try again.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchLeaveRequests = async (employeeId) => {
            try {
                const response = await axios.get(`http://localhost:5006/api/leave-requests/employee/${employeeId}`);
                if (response.data.success) {
                    setLeaveRequests(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching leave requests:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            document: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            setError('End date cannot be before start date');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('employeeId', formData.employeeId);
            formDataToSend.append('leaveCategory', formData.leaveCategory);
            formDataToSend.append('startDate', formData.startDate);
            formDataToSend.append('endDate', formData.endDate);
            formDataToSend.append('reason', formData.reason);

            if (formData.document) {
                formDataToSend.append('document', formData.document);
            }

            const response = await axios.post('http://localhost:5006/api/leave-requests', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setSuccess('Leave request submitted successfully!');

                setTimeout(() => {
                    setSuccess('');
                }, 6000);

                setFormData({
                    employeeId: formData.employeeId,
                    leaveCategory: '',
                    startDate: '',
                    endDate: '',
                    reason: '',
                    document: null
                });

                const refreshResponse = await axios.get(`http://localhost:5006/api/leave-requests/employee/${formData.employeeId}`);
                if (refreshResponse.data.success) {
                    setLeaveRequests(refreshResponse.data.data);
                }
            } else {
                setError(response.data.message || 'Failed to submit leave request');
            }
        } catch (error) {
            console.error('Error submitting leave request:', error);
            setError(error.response?.data?.message || 'An error occurred while submitting the request');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    // Separate requests into pending and processed (approved/rejected)
    const pendingRequests = leaveRequests.filter(request => request.status === 'pending');
    const processedRequests = leaveRequests.filter(request => request.status !== 'pending');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#082334]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen bg-[#01203A] text-white">
            <SideBar
                toggleSidebar={toggleSidebar}
                isVisible={isSidebarVisible}
            />

            <div className="flex-1 flex flex-col items-center justify-center">
                <NavBar toggleSidebar={toggleSidebar} />

                <div className={`w-full max-w-6xl p-6 transition-all duration-300 ${isSidebarVisible ? 'ml-64' : 'ml-0'}`}>
                    <h2 className="text-2xl mb-6 font-bold">Request Leave</h2>

                    {error && (
                        <div className="bg-red-800 p-4 rounded-lg mb-6">
                            <p className="text-white">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-800 p-4 rounded-lg mb-6">
                            <p className="text-white">{success}</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="max-w-2xl bg-[#0b436a] p-6 rounded-lg shadow-lg">
                            <div className="mb-4">
                                <label htmlFor="employeeId" className="block mb-2 font-medium">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    id="employeeId"
                                    name="employeeId"
                                    value={formData.employeeId}
                                    readOnly
                                    className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none cursor-not-allowed"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="leaveCategory" className="block mb-2 font-medium">
                                    Leave Category
                                </label>
                                <select
                                    id="leaveCategory"
                                    name="leaveCategory"
                                    value={formData.leaveCategory}
                                    onChange={handleChange}
                                    className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="startDate" className="block mb-2 font-medium">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block mb-2 font-medium">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none"
                                        required
                                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="reason" className="block mb-2 font-medium">
                                    Reason
                                </label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none"
                                    required
                                ></textarea>
                            </div>

                            {(formData.leaveCategory === 'sick' || formData.document) && (
                                <div className="mb-6">
                                    <label htmlFor="document" className="block mb-2 font-medium">
                                        {formData.leaveCategory === 'sick'
                                            ? 'Medical Certificate (Required for sick leave)'
                                            : 'Supporting Document (Optional)'}
                                    </label>
                                    <input
                                        type="file"
                                        id="document"
                                        name="document"
                                        onChange={handleFileChange}
                                        className="w-full p-2 rounded bg-[#082334] border border-[#0b436a] focus:border-blue-500 focus:outline-none"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        required={formData.leaveCategory === 'sick'}
                                    />
                                    <p className="text-sm text-gray-400 mt-1">Accepted formats:  JPG, PNG (Max 15MB)</p>
                                    {formData.document && (
                                        <p className="text-sm text-green-400 mt-1">
                                            Selected file: {formData.document.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
                            >
                                Submit Leave Request
                            </button>
                        </form>

                        {/* Pending Requests Table */}
                        {pendingRequests.length > 0 && (
                            <div className="bg-[#0b436a] p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Pending Leave Requests</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-[#082334] rounded-lg overflow-hidden">
                                        <thead className="bg-[#0b436a]">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Leave Type</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Start Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">End Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Document</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#0b436a]">
                                            {pendingRequests.map((request, index) => (
                                                <tr key={`pending-${index}`} className="hover:bg-[#0b436a]/50">
                                                    <td className="px-4 py-3 whitespace-nowrap capitalize">{request.leaveCategory}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.startDate)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.endDate)}</td>
                                                    <td className="px-4 py-3 max-w-xs truncate">{request.reason}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {request.documentUrl ? (
                                                            <a
                                                                href={request.documentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-400 hover:underline"
                                                            >
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">None</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}


                        {processedRequests.length > 0 && (
                            <div className="bg-[#0b436a] p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Leave Request History</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-[#082334] rounded-lg overflow-hidden">
                                        <thead className="bg-[#0b436a]">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Leave Type</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Start Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">End Date</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Reason</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Document</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#0b436a]">
                                            {processedRequests.map((request, index) => (
                                                <tr key={`processed-${index}`} className="hover:bg-[#0b436a]/50">
                                                    <td className="px-4 py-3 whitespace-nowrap capitalize">{request.leaveCategory}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.startDate)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(request.endDate)}</td>
                                                    <td className="px-4 py-3 max-w-xs truncate">{request.reason}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        {request.documentUrl ? (
                                                            <a
                                                                href={request.documentUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-400 hover:underline"
                                                            >
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-400">None</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}


                        {leaveRequests.length === 0 && (
                            <div className="bg-[#0b436a] p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-semibold mb-4">Your Leave Requests</h3>
                                <p className="text-gray-400">No leave requests found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestLeaveForm;