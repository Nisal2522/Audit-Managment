import express from 'express';
import { createLeaveRequest, getLeaveRequestsByEmployee, upload } from '../controllers/leaveRequestController.js';

const router = express.Router();

router.post('/', upload.single('document'), createLeaveRequest);


router.get('/employee/:employeeId', getLeaveRequestsByEmployee);

export default router;