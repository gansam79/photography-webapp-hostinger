import api from './api';

export const serviceService = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch services';
    }
  },

  // Get single service
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch service';
    }
  },

  // Create service
  createService: async (serviceData) => {
    try {
      const response = await api.post('/services', serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create service';
    }
  },

  // Update service
  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update service';
    }
  },

  // Delete service
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete service';
    }
  },
};
