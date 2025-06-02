import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add user ID to headers
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user._id) {
    config.headers['X-User-Id'] = user._id;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  }
};

// Ticket services
export const ticketService = {
  createTicket: async (ticketData) => {
    try {
      console.log('API: Creating ticket with data:', ticketData);
      const response = await api.post('/tickets', ticketData);
      console.log('API: Ticket creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error creating ticket:', error.response?.data || error.message);
      throw error;
    }
  },

  getTickets: async (filters = {}) => {
    const response = await api.get('/tickets', { params: filters });
    return response.data;
  },

  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  addComment: async (ticketId, comment) => {
    const response = await api.post(`/tickets/${ticketId}/comments`, { text: comment });
    return response.data;
  },

  assignTicket: async (ticketId, assigneeId) => {
    const response = await api.post(`/tickets/${ticketId}/assign`, { assigneeId });
    return response.data;
  },

  resolveTicket: async (ticketId, resolution) => {
    const response = await api.post(`/tickets/${ticketId}/resolve`, { resolution });
    return response.data;
  },

  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  }
};

// Analytics services
export const analyticsService = {
  getStats: async () => {
    const response = await api.get('/analytics/ticket-stats');
    return response.data;
  },

  getDepartmentStats: async () => {
    const response = await api.get('/analytics/department-stats');
    return response.data;
  },

  getAgentPerformance: async () => {
    const response = await api.get('/analytics/agent-performance');
    return response.data;
  },

  getSLACompliance: async () => {
    const response = await api.get('/analytics/sla-compliance');
    return response.data;
  }
};

// File services
export const fileService = {
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  getFile: (filename) => {
    return `${API_URL}/files/${filename}`;
  }
};

// Solution services
export const solutionService = {
  getSolutions: async () => {
    const response = await api.get('/solutions');
    return response.data;
  },

  getSolution: async (id) => {
    const response = await api.get(`/solutions/${id}`);
    return response.data;
  },

  createSolution: async (solutionData) => {
    const response = await api.post('/solutions', solutionData);
    return response.data;
  },

  updateSolution: async (id, solutionData) => {
    const response = await api.put(`/solutions/${id}`, solutionData);
    return response.data;
  },

  deleteSolution: async (id) => {
    const response = await api.delete(`/solutions/${id}`);
    return response.data;
  }
};

// User services
export const userService = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
}; 