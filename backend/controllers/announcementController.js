import Announcement from '../models/announcement.js';

export const createAnnouncement = async (req, res) => {
  try {
    const { title,subject, message, sentTo, date, sender } = req.body;

    if (!title || !subject || !message || !sentTo || !date || !sender) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newAnnouncement = new Announcement({
      title,
      subject,
      message,
      sentTo,
      date,
      sender
    });

    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};


export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the announcement exists
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Delete the announcement
    await Announcement.findByIdAndDelete(id);
    res.status(200).json({ message: 'Announcement deleted successfully' });

  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};