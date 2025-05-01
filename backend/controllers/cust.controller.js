import Customer from '../models/cust.model.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching customers",
            error: error.message
        });
    }
};

// Get single customer by ID
export const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }
        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching customer",
            error: error.message
        });
    }
};

// Create new customer
export const createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({
            success: true,
            data: customer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error creating customer",
            error: error.message
        });
    }
};

// Update customer
export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            data: customer
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating customer",
            error: error.message
        });
    }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error deleting customer",
            error: error.message
        });
    }
};

// Get customer count
export const getCustomerCount = async (req, res) => {
    try {
        const count = await Customer.countDocuments();
        res.status(200).json({
            success: true,
            count: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting customer count",
            error: error.message
        });
    }
};
