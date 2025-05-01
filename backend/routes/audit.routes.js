import express from 'express';
import {
  getAllAudits,
  addAudit,
  updateAuditStatus
} from '../controllers/audit.controller.js';

const router = express.Router();

// GET route to fetch all audits
router.get('/', getAllAudits);

// POST route to add new audit
router.post('/', addAudit);

// PUT route to update audit status
router.put('/updateStatus/:customId', updateAuditStatus);

export default router;