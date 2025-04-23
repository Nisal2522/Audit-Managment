import express from 'express';
import {  deleteLeaveRequest , updateLeaveRequestStatus , getAllLeaveRequests } from '../controllers/leaveRequestController.js';

const router = express.Router();



// Get all leave requests
router.get('/', getAllLeaveRequests);

// Update leave request status
router.patch('/:id/status', updateLeaveRequestStatus);

// Delete leave request
router.delete('/:id', deleteLeaveRequest);

export default router;