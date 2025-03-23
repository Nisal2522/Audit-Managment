//cont.controller.js in controllers folder

import Contractor from  "../models/cont.model.js"

export const createContract = async (req, res) => {
    try {
        // Set the contractDate to the current date if not provided
        const contractData = req.body;
        contractData.contractDate = new Date();  // Automatically set the current date

        const contractor = new Contractor(req.body);

        await contractor.save();

        res.status(201).json(contractor); // send JSON response
    
    } catch (error) {
        res.status(400).json({ error: error.message }); // send error message
    }
};

// Read all contracts
export const readContract = async (req, res) => {
    try {
        const contractors = await Contractor.find(); // get all contracts
        res.status(200).json(contractors); // return contracts as JSON

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Read a single contract by ID
export const readSingleContract = async (req, res) => {
    try {
        const contractor = await Contractor.findById(req.params.id); // get contract by ID
        if (!contractor) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(contractor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update contract by ID
export const updateContract = async (req, res) => {
    try {
        const updatedContractor = await Contractor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // return updated document
        );
        if (!updatedContractor) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json(updatedContractor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete contract by ID
export const deleteContract = async (req, res) => {
    try {
        const deletedContractor = await Contractor.findByIdAndDelete(req.params.id);
        if (!deletedContractor) {
            return res.status(404).json({ message: "Contract not found" });
        }
        res.status(200).json({ message: "Contract deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

