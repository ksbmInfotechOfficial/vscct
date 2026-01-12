import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem('adminUser') || 'null'),
  token: localStorage.getItem('adminToken'),
  isAuthenticated: !!localStorage.getItem('adminToken'),
  
  setAuth: (admin, token) => {
    localStorage.setItem('adminUser', JSON.stringify(admin));
    localStorage.setItem('adminToken', token);
    set({ admin, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    set({ admin: null, token: null, isAuthenticated: false });
  },
}));
