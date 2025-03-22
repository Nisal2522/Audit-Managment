import express from 'express';
import { submitAuditReport, getAuditReports, getAuditForm  , getAuditInfo} from '../controllers/audit.Controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const auditRouter = express.Router();

auditRouter.post('/report', submitAuditReport); 
auditRouter.get('/report',  getAuditReports); 
auditRouter.get('/auditForm', getAuditForm); 
auditRouter.get('/auditdetails/:id' , getAuditInfo );

export default auditRouter;