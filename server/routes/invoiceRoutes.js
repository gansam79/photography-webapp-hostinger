import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoicesByClient,
  getInvoicesByPaymentStatus,
  updatePaymentStatus,
  getOverdueInvoices,
} from '../controllers/invoiceController.js';

const router = express.Router();

// Routes
router.get('/', getAllInvoices);
router.get('/overdue', getOverdueInvoices);
router.get('/client/:clientId', getInvoicesByClient);
router.get('/status', getInvoicesByPaymentStatus);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.patch('/:id/payment-status', updatePaymentStatus);
router.delete('/:id', deleteInvoice);

export default router;
