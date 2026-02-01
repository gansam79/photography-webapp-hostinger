import api from './api';

export const clientService = {
  // Get all clients
  getAllClients: async () => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch clients';
    }
  },

  // Get single client
  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch client';
    }
  },

  // Create client
  createClient: async (clientData) => {
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create client';
    }
  },

  // Update client
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update client';
    }
  },

  // Delete client
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete client';
    }
  },

  // Search clients
  searchClients: async (query) => {
    try {
      const response = await api.get('/clients/search', { params: { query } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to search clients';
    }
  },
};
