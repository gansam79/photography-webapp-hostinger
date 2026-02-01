import express from 'express';
import { getPopup, updatePopup } from '../controllers/popupController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPopup); // Public? Yes, website needs to see it.
router.put('/', requireAuth, updatePopup); // Admin only

export default router;
