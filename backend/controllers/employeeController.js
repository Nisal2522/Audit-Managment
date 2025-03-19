//employeeController

import Employee from '../models/employee.js';

export const createEmployee = async (req, res) => {
    try {
      const { name, email, phone, role, dob, address, employeeId ,qualifiedPrograms  } = req.body;
  
      // Check if the email already exists
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      let formattedDob = null;
      if (dob) {
        formattedDob = new Date(dob).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      }

      const formattedPrograms = Array.isArray(qualifiedPrograms) ? qualifiedPrograms.map(program => ({
        programname: program.name,
        startDate: new Date(program.startDate).toISOString().split('T')[0], // YYYY-MM-DD
        expireDate: new Date(program.expireDate).toISOString().split('T')[0] // YYYY-MM-DD
      })) : [];
  
      // Create a new employee if email is unique
      const newEmployee = new Employee({
        name,
        email,
        phone,
        role,
        dob: formattedDob, // Save as a string
        address,
        employeeId, // Include employeeId in the database
        qualifiedPrograms: formattedPrograms,

      });
      const savedEmployee = await newEmployee.save();
      res.status(201).json(savedEmployee);
    } catch (err) {
      console.error('Error creating employee:', err); // Log the full error details
      res.status(500).json({ error: 'Internal Server Error', details: err.message }); // Include details in the response
    }
};


// Fetch all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update employee status
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};