import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authApi = {
  sendOtp: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOtp: (phone, otp) => api.post('/auth/verify-otp', { phone, otp }),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updateFcmToken: (token) => api.post('/user/fcm-token', { token }),
};

export const contentApi = {
  getPosts: (page = 1, perPage = 10, category = null) => 
    api.get('/content/posts', { params: { page, per_page: perPage, category } }),
  getPost: (idOrSlug) => api.get(`/content/posts/${idOrSlug}`),
  getCategories: () => api.get('/content/categories'),
  getEvents: (page = 1, perPage = 10) => 
    api.get('/content/events', { params: { page, per_page: perPage } }),
};

export default api;
