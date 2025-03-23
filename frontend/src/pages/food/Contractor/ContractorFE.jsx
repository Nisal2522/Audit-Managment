import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../../../components/NavBar';
import SideBar from '../../../components/SideBar';

const ContractorFE = () => {
    const [contracts, setContracts] = useState([]);
    const [formData, setFormData] = useState({
        projectID: '',
        projectName: '',
        clientID: '',
        clientName: '',
        auditStartDate: '',
        auditEndDate: '',
        offerDays: '',
        manDayCost: ''
    });
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);

    // Fetch all contracts
    const fetchContracts = async () => {
        try {
            const response = await axios.get('/api/contractor/readcontract');
            console.log('Fetched contracts:', response.data);

            // Ensure the contracts are an array
            let contractList = [];
            if (Array.isArray(response.data)) {
                contractList = response.data;
            } else if (Array.isArray(response.data.contracts)) {
                contractList = response.data.contracts;
            } else if (Array.isArray(response.data.data)) {
                contractList = response.data.data;
            } else {
                console.warn('Contracts data is not an array:', response.data);
            }

            setContracts(contractList);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Create a new contract
    const handleCreateContract = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/contractor/createcontract', formData);
            fetchContracts(); // Refresh the list
            setFormData({
                projectID: '',
                projectName: '',
                clientID: '',
                clientName: '',
                auditStartDate: '',
                auditEndDate: '',
                offerDays: '',
                manDayCost: ''
            });
        } catch (error) {
            console.error('Error creating contract:', error);
        }
    };

    // Update a contract
    const handleUpdateContract = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/contractor/updatecontract/${selectedContractId}`, formData);
            fetchContracts(); // Refresh the list
            setSelectedContractId(null);
            setFormData({
                projectID: '',
                projectName: '',
                clientID: '',
                clientName: '',
                auditStartDate: '',
                auditEndDate: '',
                offerDays: '',
                manDayCost: ''
            });
        } catch (error) {
            console.error('Error updating contract:', error);
        }
    };

    // Delete a contract
    const handleDeleteContract = async (id) => {
        try {
            await axios.delete(`/api/contractor/deletecontract/${id}`);
            fetchContracts(); // Refresh the list
        } catch (error) {
            console.error('Error deleting contract:', error);
        }
    };

    // Load contract data into form for editing
    const loadContractForEdit = async (id) => {
        try {
            const response = await axios.get(`/api/contractor/readsinglecontract/${id}`);
            setFormData(response.data);
            setSelectedContractId(id);
        } catch (error) {
            console.error('Error loading contract for edit:', error);
        }
    };

    //SideBarToggle
    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
      };


    return (
        <div>
            
            <NavBar toggleSidebar={toggleSidebar} />
            {isSidebarVisible && <SideBar toggleSidebar={toggleSidebar} />}
           
            <h1>Contractor Management</h1>

            {/* Form for creating/updating contracts */}
            <form onSubmit={selectedContractId ? handleUpdateContract : handleCreateContract}>
                <input
                    type="text"
                    name="projectID"
                    placeholder="Project ID"
                    value={formData.projectID}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="projectName"
                    placeholder="Project Name"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="clientID"
                    placeholder="Client ID"
                    value={formData.clientID}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="clientName"
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="auditStartDate"
                    placeholder="Audit Start Date"
                    value={formData.auditStartDate}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="date"
                    name="auditEndDate"
                    placeholder="Audit End Date"
                    value={formData.auditEndDate}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="offerDays"
                    placeholder="Offer Days"
                    value={formData.offerDays}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="manDayCost"
                    placeholder="Man Day Cost"
                    value={formData.manDayCost}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">
                    {selectedContractId ? 'Update Contract' : 'Create Contract'}
                </button>
            </form>

            {/* List of contracts */}
            <h2>Contracts</h2>
            <ul>
                {Array.isArray(contracts) && contracts.length > 0 ? (
                    contracts.map((contract) => (
                        <li key={contract._id}>
                            <strong>{contract.projectName}</strong> - {contract.clientName}
                            <button onClick={() => loadContractForEdit(contract._id)}>Edit</button>
                            <button onClick={() => handleDeleteContract(contract._id)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <li>No contracts available</li>
                )}
            </ul>
        </div>
    );
};

export default ContractorFE;
