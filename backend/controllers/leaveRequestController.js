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

export const createLeaveRequest = async (req, res) => {
  try {
    const { employeeId, leaveCategory, startDate, endDate, reason } = req.body;
    
    // Basic validation
    if (!employeeId || !leaveCategory || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    let documentUrl = null;
    
    // Handle file upload
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'leave_documents' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          uploadStream.end(req.file.buffer);
        });
        
        documentUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'File upload failed',
          error: uploadError.message
        });
      }
    }

    // Validate sick leave document
    if (leaveCategory === 'sick' && !documentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Medical certificate is required for sick leave'
      });
    }

    // Create leave request
    const newRequest = new LeaveRequest({
      employeeId,
      leaveCategory,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      documentUrl,
      status: 'pending'
    });

    await newRequest.save();

    return res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: newRequest
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getLeaveRequestsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const requests = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leave requests'
    });
  }
};