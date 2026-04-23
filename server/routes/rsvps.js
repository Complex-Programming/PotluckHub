import { Router } from 'express';
import { createRsvp, deleteRsvp, getAttendeesByEventId } from '../controllers/rsvps.js';

const router = Router();

router.get('/:eventId', getAttendeesByEventId);
router.post('/', createRsvp);
router.delete('/', deleteRsvp);

export default router;
