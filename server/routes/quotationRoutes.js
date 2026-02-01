import express from 'express';
import {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  duplicateQuotation,
  getQuotationsByClient,
  getQuotationsByStatus,
} from '../controllers/quotationController.js';

const router = express.Router();

// Routes
router.get('/', getAllQuotations);
router.get('/client/:clientId', getQuotationsByClient);
router.get('/status', getQuotationsByStatus);
router.get('/:id', getQuotationById);
router.post('/', createQuotation);
router.post('/:id/duplicate', duplicateQuotation);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

export default router;
