import Chat from '../models/chat.js';
import DepartmentHead from '../models/departmenthead.js';

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message, senderRole } = req.body;
    const senderId = req.user.id; // Assuming you have user info in req.user

    // Find or create a chat between these two participants
    let chat = await Chat.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: senderId } },
          { $elemMatch: { userId: recipientId } }
        ]
      }
    });

    if (!chat) {
      // Create a new chat if one doesn't exist
      chat = new Chat({
        participants: [
          { userId: senderId, role: senderRole },
          { userId: recipientId, role: 'departmentHead' }
        ],
        messages: []
      });
    }

    // Add the new message
    chat.messages.push({
      senderId,
      senderRole,
      content: message
    });

    chat.lastUpdated = new Date();
    await chat.save();

    // Populate sender info for the response
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants.userId', 'firstname lastname')
      .populate('messages.senderId', 'firstname lastname');

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({
      'participants.userId': userId
    })
    .populate('participants.userId', 'firstname lastname profilePic department')
    .sort({ lastUpdated: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findOne({
      _id: chatId,
      'participants.userId': userId
    })
    .populate('messages.senderId', 'firstname lastname profilePic')
    .populate('participants.userId', 'firstname lastname profilePic');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Failed to fetch chat messages' });
  }
};