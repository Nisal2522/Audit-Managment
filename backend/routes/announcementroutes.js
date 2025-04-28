import express from 'express';
import { createAnnouncement , getAnnouncements ,deleteAnnouncement,getAnnouncementsonlyfour  } from '../controllers/announcementController.js';

const router = express.Router();

router.post('/create', createAnnouncement);

router.get('/', getAnnouncements); 

router.delete('/:id', deleteAnnouncement);

router.get('/latest', getAnnouncementsonlyfour);


export default router;