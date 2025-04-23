// routes/adminroutes.js
import express from 'express';
import { getDepartmentHeads ,updateDepartmentHead ,deleteDepartmentHead,resetPassword,getActivityLog ,getDailyActivityStats ,sendMessage, getMessages , getDepartmentHeadswithadmin , updateMessageStatus , getUnreadCounts  } from '../controllers/admincontroller.js';

const router = express.Router();

// Protected admin routes
router.get('/department-heads',  getDepartmentHeads);

router.put('/department-heads/:id', updateDepartmentHead);

router.delete('/department-heads/:id', deleteDepartmentHead);

router.post('/reset-password', resetPassword);

router.get('/activity-log', getActivityLog);

// routes/adminRoutes.js
router.get('/daily-activity-stats', getDailyActivityStats);


router.post('/send-message', sendMessage);
router.get('/messages/:employeeId', getMessages);

router.get('/department-headswithadmin',  getDepartmentHeadswithadmin);

router.put('/update-message-status', updateMessageStatus);

router.get('/unread-counts', getUnreadCounts);

export default router;