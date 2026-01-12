import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  
  initialize: async () => {
    try {
      const [user, accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('refreshToken'),
      ]);
      
      if (user && accessToken) {
        set({
          user: JSON.parse(user),
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },
  
  setAuth: async (user, accessToken, refreshToken) => {
    await Promise.all([
      AsyncStorage.setItem('user', JSON.stringify(user)),
      AsyncStorage.setItem('accessToken', accessToken),
      AsyncStorage.setItem('refreshToken', refreshToken),
    ]);
    
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },
  
  updateUser: async (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
  
  logout: async () => {
    await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },
}));
