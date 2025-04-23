import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import ChatMessage from '../models/ChatMessage.js';
import nodemailer from 'nodemailer';




export const getDepartmentHeads = async (req, res) => {
    try {
        const heads = await User.find({ position: 'Department Head' })
            .select('firstname lastname department position email status employeeid phone profilePic')
            .lean();

        console.log("Fetched Department Heads:", heads); // Log the data

        if (!Array.isArray(heads)) {
            console.error("Invalid data format received:", heads);
            return res.status(200).json([]);
        }

        res.status(200).json(heads);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};



// Update department head
// In your updateDepartmentHead controller
export const updateDepartmentHead = async (req, res) => {
  try {
    const { id } = req.params;
    const { activityType, performedBy, ...updateData } = req.body;

    // Validate required fields
    if (!updateData.firstname || !updateData.lastname || !updateData.department) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and department are required'
      });
    }

    // Find and update the department head
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Department head not found'
      });
    }

    // Update fields
    user.firstname = updateData.firstname;
    user.lastname = updateData.lastname;
    user.department = updateData.department;
    user.email = updateData.email;
    user.phone = updateData.phone;
    user.status = updateData.status;
    user.employeeid = updateData.employeeid;
    
    // Add activity log
    user.activityType = activityType;
    user.performedBy = performedBy;
    
    const updatedHead = await user.save();

    res.status(200).json(updatedHead);
  } catch (error) {
    console.error('Error updating department head:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};




// Delete department head
export const deleteDepartmentHead = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedHead = await User.findByIdAndDelete(id);

        if (!deletedHead) {
            return res.status(404).json({
                success: false,
                message: 'Department head not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Department head deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting department head:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};


// Add this to your password reset controller
export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword, activityType, performedBy } = req.body;
    
    // Find user and update password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Add activity log
    user.activityType = activityType;
    user.performedBy = performedBy;
    
    await user.save();
    
    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: user.email, 
      subject: 'Password Reset Notification - Audit Planning System',
      html: ` 
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://drive.google.com/uc?export=view&id=1r0A2Y1PgSz5xyq9e7zSIqx5EIA89TU6T" alt="Audit Planning System Logo" style="max-width: 250px; margin-bottom: 10px;" />
            <h1 style="color: #2e51af; font-size: 36px; margin: 10px 0; font-weight: bold;">Audit Planning System</h1>
          </div>
          <p style="font-size: 18px; color: #333;">Hello <strong>${user.firstname} ${user.lastname}</strong>,</p>
          <p style="font-size: 16px; color: #444;">Your password for the <strong>Audit Planning System</strong> has been successfully reset by the administrator.</p>
          <div style="margin: 25px 0; padding: 15px; background-color: #ffebee; border-left: 4px solid #d32f2f; border-radius: 4px;">
              <h3 style="color: #d32f2f; font-size: 18px; margin-top: 0; margin-bottom: 10px;">
                <span style="font-size: 20px;">⚠️</span> Important Security Notice
              </h3>
              <ul style="padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 8px;">Never share your password with anyone, including system administrators</li>
                <li style="margin-bottom: 8px;">Our team will NEVER ask for your password via email or phone</li>
                <li style="margin-bottom: 8px;">This password reset was performed by an authorized administrator</li>
                <li style="margin-bottom: 8px;">Store your new password securely and avoid reusing it elsewhere</li>
                <li>Beware of phishing attempts - always verify email senders</li>
              </ul>
            </div>
            
          <div style="margin: 20px 0; padding: 15px; background-color: #e9f2fc; border-radius: 6px;">
            <p style="color: #2e51af; font-weight: bold; font-size: 20px; margin-bottom: 10px;">Reset Details:</p>
                         <p style="font-size: 16px; margin: 5px 0;"><strong>Email:</strong> ${user.email} </p>
             <p style="font-size: 16px; margin: 5px 0;"><strong>PassWord:</strong> ${newPassword || tempPassword} </p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Reset by:</strong> System Administrator</p>
          </div>
           

          <p style="font-size: 16px; color: #d32f2f; font-weight: bold;">
            If you did not request this password reset, please contact your administrator immediately.
          </p>

          

          
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Password reset but failed to send notification email' 
        });
      } else {
        console.log('Email sent:', info.response);
        res.json({ 
          success: true, 
          message: 'Password reset successfully and notification sent' 
        });
      }
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ 
      success: false, 
      message: error.response?.data?.message || 'Server error during password reset' 
    });
  }
};

// controllers/admincontroller.js
export const getActivityLog = async (req, res) => {
    try {
      const logs = await User.aggregate([
        { $unwind: '$activity' },
        { $sort: { 'activity.timestamp': -1 } },
        { $limit: 10 },
        { $project: {
          _id: 0,
          action: '$activity.type',
          timestamp: '$activity.timestamp',
          user: { $concat: ['$firstname', ' ', '$lastname'] },
          department: '$department',
          details: '$activity.details',
          employeeid: '$employeeid'
        }}
      ]);

      // Format timestamp to "X minutes ago"
      const formattedLogs = logs.map(log => ({
        ...log,
        time: formatTimeAgo(log.timestamp)
      }));

      res.status(200).json(formattedLogs);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch activity log',
        error: error.message
      });
    }
};

// Helper function to format time
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  return 'Just now';
}


// controllers/adminController.js
export const getDailyActivityStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $unwind: '$activity' },
      { 
        $match: { 
          'activity.type': { $in: ['password_reset', 'account_update'] },
          'activity.timestamp': { 
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
          }
        }
      },
      {
        $group: {
          _id: {
            date: '$activity.date',
            type: '$activity.type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          date: { $first: '$_id.date' },
          activities: {
            $push: {
              type: '$_id.type',
              count: '$count'
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 7 } // Last 7 days
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily activity stats',
      error: error.message
    });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { employeeId, message, senderEmployeeId } = req.body;

    if (!employeeId || !message || !senderEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, sender ID and message are required'
      });
    }

    const newMessage = await ChatMessage.create({
      sender: 'admin', // or 'department_head' based on who's sending
      senderEmployeeId,
      receiverEmployeeId: employeeId,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // For backward compatibility, we'll check both old and new message formats
    const messages = await ChatMessage.find({
      $or: [
        // Old format (just employeeId)
        { employeeId },
        // New format (sender/receiver)
        { 
          $or: [
            { senderEmployeeId: employeeId },
            { receiverEmployeeId: employeeId }
          ]
        }
      ]
    }).sort({ timestamp: 1 });

    // Transform messages to consistent format
    const transformedMessages = messages.map(msg => {
      // For messages in old format
      if (msg.employeeId) {
        return {
          ...msg._doc,
          senderEmployeeId: msg.employeeId,
          receiverEmployeeId: req.user.employeeid,
          isLegacy: true
        };
      }
      return msg;
    });

    res.status(200).json({
      success: true,
      data: transformedMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};


export const getDepartmentHeadswithadmin = async (req, res) => {
  try {
      const heads = await User.find({ 
          $or: [
              { position: 'Department Head' },
              { position: 'Admin' }
          ]
      })
      .select('firstname lastname department position email status employeeid phone profilePic')
      .lean();

      console.log("Fetched Department Heads and Admins:", heads); // Updated log message

      if (!Array.isArray(heads)) {
          console.error("Invalid data format received:", heads);
          return res.status(200).json([]);
      }

      res.status(200).json(heads);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
          success: false,
          message: 'Server error',
          error: error.message 
      });
  }
};


// Update message read status
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({
        success: false,
        message: 'Message IDs array is required'
      });
    }

    // Update all messages to mark them as read
    const result = await ChatMessage.updateMany(
      { _id: { $in: messageIds } },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
      data: result
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status',
      error: error.message
    });
  }
};



// New endpoint to get unread message counts
export const getUnreadCounts = async (req, res) => {
  try {
    const { receiverEmployeeId } = req.query;
    
    if (!receiverEmployeeId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver employee ID is required'
      });
    }

    // Group messages by sender and count unread ones
    const unreadMessages = await ChatMessage.aggregate([
      {
        $match: {
          receiverEmployeeId: receiverEmployeeId,
          read: false
        }
      },
      {
        $group: {
          _id: "$senderEmployeeId",
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert array to object with senderEmployeeId as keys
    const unreadCounts = {};
    unreadMessages.forEach(item => {
      unreadCounts[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      unreadCounts
    });
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread counts',
      error: error.message
    });
  }
};