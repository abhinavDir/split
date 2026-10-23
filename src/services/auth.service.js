import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem('split_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('split_access_token');
      localStorage.removeItem('split_refresh_token');
      localStorage.removeItem('split_user');
    }
  },

  async getMe() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateMe(updateData) {
    const response = await api.patch('/users/me', updateData);
    return response.data;
  },

  async updateUpi(upiId) {
    const response = await api.patch('/users/me/upi', { upiId });
    return response.data;
  },

  async getUserUpi(userId) {
    const response = await api.get(`/users/${userId}/upi`);
    return response.data;
  },

  async searchUsers(query) {
    const response = await api.get(`/users/search?email=${encodeURIComponent(query)}`);
    return response.data;
  },
};
