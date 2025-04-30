import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  leaveCategory: {
    type: String,
    required: true,
    enum: ['vacation', 'sick', 'personal']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  documentUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;