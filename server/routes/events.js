import express from 'express';
import { 
    getAllEvents, 
    getEventById, 
    createEvent, 
    getEventAttendees, // <-- New
    createRSVP,        // <-- New
    deleteRSVP,         // <-- New
    getEventDishes,     // <-- New
    claimDish           // <-- New
} from '../controllers/events.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);

// The new RSVP routes
router.get('/:id/attendees', getEventAttendees);
router.post('/:id/rsvp', createRSVP);
router.delete('/:id/rsvp', deleteRSVP);
router.get('/:id/dishes', getEventDishes);
router.post('/:id/dishes', claimDish);

export default router;