import api from './api';

export const paymentService = {
  // Record payment
  recordPayment: async (invoiceId, paymentData) => {
    try {
      const response = await api.post(`/payments/invoice/${invoiceId}`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to record payment';
    }
  },

  // Get payments for invoice
  getPaymentsByInvoice: async (invoiceId) => {
    try {
      const response = await api.get(`/payments/invoice/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch payments';
    }
  },

  // Get payments for client
  getPaymentsByClient: async (clientId) => {
    try {
      const response = await api.get(`/payments/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch payments';
    }
  },

  // Get all payments
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch payments';
    }
  },

  // Get payment summary
  getPaymentSummary: async () => {
    try {
      const response = await api.get('/payments/summary');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch payment summary';
    }
  },

  // Delete payment
  deletePayment: async (id) => {
    try {
      const response = await api.delete(`/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete payment';
    }
  },
};
