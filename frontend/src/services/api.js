import axios from 'axios';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_URL = isLocal ? 'http://localhost:5000/api' : `http://${window.location.hostname}:5000/api`;

const API = axios.create({
  baseURL: BASE_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  updateLocation: (data) => API.put('/users/location', data)
};

export const workerAPI = {
  getNearby: (params) => API.get('/workers/nearby', { params }),
  search: (name) => API.get('/workers/search', { params: { name } }),
  getProfile: () => API.get('/workers/profile'),
  updateAvailability: (data) => API.put('/workers/availability', data),
  updateSkills: (data) => API.put('/workers/skills', data),
  getBookings: () => API.get('/workers/bookings')
};

export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getAll: () => API.get('/bookings'),
  updateStatus: (id, data) => API.put(`/bookings/${id}/status`, data),
  rate: (id, data) => API.put(`/bookings/${id}/rate`, data),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
  reschedule: (id, data) => API.put(`/bookings/${id}/reschedule`, data)
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  getWorkers: () => API.get('/admin/workers'),
  approveWorker: (id) => API.put(`/admin/workers/${id}/approve`),
  updateWorker: (id, data) => API.put(`/admin/workers/${id}`, data),
  deleteWorker: (id) => API.delete(`/admin/workers/${id}`),
  getBookings: () => API.get('/admin/bookings')
};

export const chatAPI = {
  sendMessage: (data) => API.post('/chat/send', data),
  getMessages: (bookingId) => API.get(`/chat/booking/${bookingId}`),
  markAsRead: (bookingId) => API.put(`/chat/read/${bookingId}`),
  getUnreadCount: () => API.get('/chat/unread-count')
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  getUnreadCount: () => API.get('/notifications/unread-count'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllAsRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`)
};

export default API;
