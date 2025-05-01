import Audit from '../models/audit.model.js';

// Fetch all audits
export const getAllAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.status(200).json({
      success: true,
      data: audits
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching audits', 
      error: error.message 
    });
  }
};

// Add new audit
export const addAudit = async (req, res) => {
  try {
    const audit = await Audit.create(req.body);
    res.status(201).json({
      success: true,
      data: audit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating audit',
      error: error.message
    });
  }
};

// Update audit status
export const updateAuditStatus = async (req, res) => {
  try {
    const { customId } = req.params;
    const { auditStatus } = req.body;

    const updatedAudit = await Audit.findOneAndUpdate(
      { customId },
      { auditStatus },
      { new: true }
    );

    if (!updatedAudit) {
      return res.status(404).json({ success: false, message: 'Audit not found' });
    }

    res.status(200).json({ success: true, data: updatedAudit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};