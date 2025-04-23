import express from 'express';
import { getEmployees, updateEmployee  ,deleteEmployee   } from '../controllers/employeeController.js';



const router = express.Router();

// Fetch all employees
router.get('/employees', getEmployees);

// Update employee 
router.put('/employees/:id', updateEmployee);



//delete employee from the database
router.delete('/employees/:id', deleteEmployee);




export default router;