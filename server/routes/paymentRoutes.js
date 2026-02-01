import express from 'express';
import {
  recordPayment,
  getPaymentsByInvoice,
  getPaymentsByClient,
  deletePayment,
  getAllPayments,
  getPaymentById,
  getPaymentSummary,
} from '../controllers/paymentController.js';

const router = express.Router();

// Routes
router.get('/', getAllPayments);
router.get('/summary', getPaymentSummary);
router.get('/invoice/:invoiceId', getPaymentsByInvoice);
router.get('/client/:clientId', getPaymentsByClient);
router.get('/:id', getPaymentById);
router.post('/invoice/:invoiceId', recordPayment);
router.delete('/:id', deletePayment);

export default router;
