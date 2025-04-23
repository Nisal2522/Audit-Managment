// src/services/admin.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

// Set up axios instance with auth headers
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Department Heads
export const getDepartmentHeads = async () => {
  try {
    const response = await adminApi.get('/api/admin/department-heads');
    return response.data;
  } catch (error) {
    console.error('Error fetching department heads:', error);
    throw error;
  }
};

export const updateDepartmentHead = async (id, updateData) => {
  try {
    const response = await adminApi.put(`/api/admin/department-heads/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating department head:', error);
    throw error;
  }
};

export const deleteDepartmentHead = async (id) => {
  try {
    const response = await adminApi.delete(`/api/admin/department-heads/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department head:', error);
    throw error;
  }
};

// Password Reset
export const resetPassword = async (userId, newPassword) => {
  try {
    const response = await adminApi.post('/api/admin/reset-password', {
      userId,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Dashboard Stats
export const getDashboardStats = async () => {
  try {
    // You'll need to create this endpoint in your backend
    const [headsRes, activityRes] = await Promise.all([
      adminApi.get('/api/admin/department-heads'),
      adminApi.get('/api/admin/activity-log') // Create this endpoint
    ]);
    
    const heads = headsRes.data;
    const activityLog = activityRes.data;
    
    return {
      totalHeads: heads.length,
      activeAccounts: heads.filter(h => h.status === 'Active').length,
      inactiveAccounts: heads.filter(h => h.status !== 'Active').length,
      recentResets: 0, // You'll need to track this
      departments: [...new Set(heads.map(h => h.department))].map(dept => ({
        name: dept,
        head: heads.find(h => h.department === dept)?.firstname + ' ' + 
              heads.find(h => h.department === dept)?.lastname,
        activeUsers: heads.filter(h => 
          h.department === dept && h.status === 'Active'
        ).length
      })),
      activityLog
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};