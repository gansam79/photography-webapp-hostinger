import express from 'express';
import { getSettings, updateSettings } from '../controllers/systemSettingsController.js';

const router = express.Router();

// Routes
router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
