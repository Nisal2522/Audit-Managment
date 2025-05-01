//cont.controller.js in controllers folder

import Contractor from  "../models/cont.model.js"

export const createContract = async (req, res) => {
    try {
        console.log("Received contract data:", req.body);

        // Validate required fields
        const requiredFields = [
            'customId', 'projectName', 'unit', 'location', 'program',
            'auditType', 'auditorId', 'auditorName', 'auditStartDate',
            'auditEndDate', 'offerDays', 'manDayCost'
        ];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                throw new Error(`${field} is required`);
            }
        }

        // Create contract data object with all fields
        const contractData = {
            customId: req.body.customId,
            projectName: req.body.projectName,
            unit: req.body.unit,
            location: req.body.location,
            program: req.body.program,
            auditType: req.body.auditType,
            auditorId: req.body.auditorId,
            auditorName: req.body.auditorName,
            contractDate: new Date(),
            auditStartDate: new Date(req.body.auditStartDate),
            auditEndDate: new Date(req.body.auditEndDate),
            offerDays: Number(req.body.offerDays),
            manDayCost: Number(req.body.manDayCost),
            exchangeRate: Number(req.body.exchangeRate) || 300, // Use provided rate or fallback
            status: req.body.status || "Pending"
        };

        console.log("Processed contract data:", contractData);

        const contractor = new Contractor(contractData);
        await contractor.save();

        console.log("Saved contract:", contractor);
        res.status(201).json(contractor);
    
    } catch (error) {
        console.error("Error creating contract:", error);
        res.status(400).json({ error: error.message });
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
        // If exchange rate is provided in the update, ensure it's a number
        if (req.body.exchangeRate) {
            req.body.exchangeRate = Number(req.body.exchangeRate);
        }
        
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

