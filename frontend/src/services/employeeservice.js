import axios from 'axios';

const API_BASE_URL = 'http://localhost:5005/api';

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/employees/create`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/employees`);
    // Return the data directly if it's an array, otherwise return empty array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching employees:", error.response ? error.response.data : error.message);
    return []; // Return empty array on error
  }
};