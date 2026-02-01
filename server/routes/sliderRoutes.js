import express from 'express';
import {
    getAllSliders,
    createSlider,
    updateSlider,
    deleteSlider
} from '../controllers/sliderController.js';

const router = express.Router();

router.get('/', getAllSliders);
router.post('/', createSlider);
router.put('/:id', updateSlider);
router.delete('/:id', deleteSlider);

export default router;
