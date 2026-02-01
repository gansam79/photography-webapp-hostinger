import api from './api';

export const invoiceService = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const response = await api.get('/invoices');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch invoices';
    }
  },

  // Get single invoice
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch invoice';
    }
  },

  // Create invoice
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create invoice';
    }
  },

  // Update invoice
  updateInvoice: async (id, invoiceData) => {
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update invoice';
    }
  },

  // Delete invoice
  deleteInvoice: async (id) => {
    try {
      const response = await api.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete invoice';
    }
  },

  // Get invoices by client
  getInvoicesByClient: async (clientId) => {
    try {
      const response = await api.get(`/invoices/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch invoices';
    }
  },

  // Get invoices by payment status
  getInvoicesByPaymentStatus: async (status) => {
    try {
      const response = await api.get('/invoices/status', { params: { status } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch invoices';
    }
  },

  // Update payment status
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      const response = await api.patch(`/invoices/${id}/payment-status`, { paymentStatus });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update payment status';
    }
  },

  // Get overdue invoices
  getOverdueInvoices: async () => {
    try {
      const response = await api.get('/invoices/overdue');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch overdue invoices';
    }
  },
};
