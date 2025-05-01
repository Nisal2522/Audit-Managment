import express from 'express';
import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerCount
} from '../controllers/cust.controller.js';

const router = express.Router();

// Get all customers
router.get('/', getAllCustomers);

// Get customer count
router.get('/count', getCustomerCount);

// Get single customer
router.get('/:id', getCustomerById);

// Create new customer
router.post('/', createCustomer);

// Update customer
router.put('/:id', updateCustomer);

// Delete customer
router.delete('/:id', deleteCustomer);

export default router;