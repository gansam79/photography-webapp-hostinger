import express from 'express';
import {
    getAllEventTypes,
    createEventType,
    updateEventType,
    deleteEventType
} from '../controllers/eventTypeController.js';

const router = express.Router();

router.get('/', getAllEventTypes);
router.post('/', createEventType);
router.put('/:id', updateEventType);
router.delete('/:id', deleteEventType);

export default router;
