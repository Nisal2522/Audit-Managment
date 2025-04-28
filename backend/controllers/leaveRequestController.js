import LeaveRequest from '../models/LeaveRequest.js';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Correct Cloudinary configuration
cloudinary.config({
  cloud_name: 'dx2aqta9f',
  api_key: '755417171198543',
  api_secret: 'rtoamD6NYhuJRdyX2Ux32EVaz4M'
});

// Multer configuration
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image (jpg, jpeg, png) and PDF files are allowed!'), false);
    }
  }
});



export const getAllLeaveRequests = async (req, res) => {
    try {
      const requests = await LeaveRequest.find().sort({ createdAt: -1 });
      return res.status(200).json(requests); // Changed to return array directly
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch leave requests'
      });
    }
  };


  // Update leave request status
export const updateLeaveRequestStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
  
      const updatedRequest = await LeaveRequest.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Leave request status updated',
        data: updatedRequest
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update leave request'
      });
    }
  };

  
  // Delete leave request
export const deleteLeaveRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRequest = await LeaveRequest.findByIdAndDelete(id);
  
      if (!deletedRequest) {
        return res.status(404).json({
          success: false,
          message: 'Leave request not found'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Leave request deleted successfully'
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete leave request'
      });
    }
  };

  export const getLeaveRequestStats = async (req, res) => {
    try {
      const totalRequests = await LeaveRequest.countDocuments();
      const pendingRequests = await LeaveRequest.countDocuments({ status: 'pending' });
      const approvedRequests = await LeaveRequest.countDocuments({ status: 'approved' });
      const rejectedRequests = await LeaveRequest.countDocuments({ status: 'rejected' });
  
      return res.status(200).json({
        success: true,
        data: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests
        }
      });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch leave request statistics'
      });
    }
  };