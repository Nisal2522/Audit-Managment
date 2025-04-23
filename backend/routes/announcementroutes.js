import express from 'express';
import { createAnnouncement , getAnnouncements ,deleteAnnouncement  } from '../controllers/announcementController.js';

const router = express.Router();

router.post('/create', createAnnouncement);

router.get('/', getAnnouncements); 

router.delete('/:id', deleteAnnouncement);


export default router;