import { create } from 'zustand';
import { authService, type AuthResponse } from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  preferences?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: false;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    try {
      const data: AuthResponse = await authService.login({ email, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isAuthenticated: true });
    } catch (error) {
      // Re-throw the error so the component can catch and display it
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const data: AuthResponse = await authService.register({ email, password, name });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      set({ user: data.user, token: data.access_token, isAuthenticated: true });
    } catch (error) {
      // Re-throw the error so the component can catch and display it
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },
}));
