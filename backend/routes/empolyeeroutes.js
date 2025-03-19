import express from 'express';
import { getEmployees, updateEmployeeStatus } from '../controllers/employeeController.js';

const router = express.Router();

// Fetch all employees
router.get('/employees', getEmployees);

// Update employee status
router.put('/employees/:id/status', updateEmployeeStatus);

export default router;