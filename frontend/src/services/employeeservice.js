//employeeservice

import axios from 'axios';

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post('http://localhost:5005/api/employees/create', employeeData);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error.response ? error.response.data : error.message);
    throw error; // Optional: you can handle or propagate this error as needed
  }
};