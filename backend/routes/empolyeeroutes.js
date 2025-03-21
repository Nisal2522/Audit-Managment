import express from 'express';
import { getEmployees, updateEmployee  ,deleteEmployee } from '../controllers/employeeController.js';

const router = express.Router();

// Fetch all employees
router.get('/employees', getEmployees);

//Update employee status
router.put('/employees/:id', updateEmployee);

// Delete employee
router.delete('/employees/:id', deleteEmployee);

export default router;