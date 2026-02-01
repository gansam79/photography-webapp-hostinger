import api from './api';

export const quotationService = {
  // Get all quotations
  getAllQuotations: async () => {
    try {
      const response = await api.get('/quotations');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch quotations';
    }
  },

  // Get single quotation
  getQuotationById: async (id) => {
    try {
      const response = await api.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch quotation';
    }
  },

  // Create quotation
  createQuotation: async (quotationData) => {
    try {
      const response = await api.post('/quotations', quotationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create quotation';
    }
  },

  // Update quotation
  updateQuotation: async (id, quotationData) => {
    try {
      const response = await api.put(`/quotations/${id}`, quotationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update quotation';
    }
  },

  // Delete quotation
  deleteQuotation: async (id) => {
    try {
      const response = await api.delete(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete quotation';
    }
  },

  // Duplicate quotation
  duplicateQuotation: async (id) => {
    try {
      const response = await api.post(`/quotations/${id}/duplicate`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to duplicate quotation';
    }
  },

  // Get quotations by client
  getQuotationsByClient: async (clientId) => {
    try {
      const response = await api.get(`/quotations/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch quotations';
    }
  },

  // Get quotations by status
  getQuotationsByStatus: async (status) => {
    try {
      const response = await api.get('/quotations/status', { params: { status } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch quotations';
    }
  },
};
