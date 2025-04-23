import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {type: String,required: true},
  subject:{ type: String, required: true },
  message: { type: String, required: true },
  sentTo: { type: mongoose.Schema.Types.Mixed, required: true },  
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  sender: {
    email: String,
    employeeid:String,
    position: String,
    department: String
  },
  
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;