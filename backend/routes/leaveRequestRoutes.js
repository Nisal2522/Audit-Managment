import express from 'express';
import {  deleteLeaveRequest , updateLeaveRequestStatus , getAllLeaveRequests,getLeaveRequestStats } from '../controllers/leaveRequestController.js';

const router = express.Router();



// Get all leave requests
router.get('/', getAllLeaveRequests);

// Update leave request status
router.patch('/:id/status', updateLeaveRequestStatus);

// Delete leave request
router.delete('/:id', deleteLeaveRequest);

router.get('/stats', getLeaveRequestStats)

export default router;