import express from 'express';
import {
    getAllGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
} from '../controllers/galleryController.js';

const router = express.Router();

router.get('/', getAllGalleryItems);
router.post('/', createGalleryItem);
router.put('/:id', updateGalleryItem);
router.delete('/:id', deleteGalleryItem);

export default router;
