// models/ChatMessage.js
import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['admin', 'department_head']
  },
  senderEmployeeId: {
    type: String,
    required: true
  },
  receiverEmployeeId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
  
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;