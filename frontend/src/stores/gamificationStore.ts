import { create } from 'zustand';
import type { UserProgress, Badge, UserBadge, XPGainResult } from '../types/gamification';
import { api } from '../services/api';

interface GamificationState {
  progress: UserProgress | null;
  badges: Badge[];
  unlockedBadges: UserBadge[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProgress: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchUnlockedBadges: () => Promise<void>;
  addXP: (amount: number, reason: string) => Promise<XPGainResult | null>;
  updateStreak: () => Promise<void>;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  progress: null,
  badges: [],
  unlockedBadges: [],
  loading: false,
  error: null,

  fetchProgress: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/gamification/progress');
      set({ progress: response.data, loading: false });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener progreso';
      set({
        error: errorMessage,
        loading: false
      });
    }
  },

  fetchBadges: async () => {
    try {
      const response = await api.get('/gamification/badges');
      set({ badges: response.data });
    } catch (error: unknown) {
      console.error('Error fetching badges:', error);
    }
  },

  fetchUnlockedBadges: async () => {
    try {
      const response = await api.get('/gamification/badges/unlocked');
      set({ unlockedBadges: response.data });
    } catch (error: unknown) {
      console.error('Error fetching unlocked badges:', error);
    }
  },

  addXP: async (amount: number, reason: string) => {
    try {
      const response = await api.post('/gamification/xp', { amount, reason });
      const result: XPGainResult = response.data;

      // Actualizar el progreso local
      set({ progress: result.progress });

      // Si desbloqueó badges, refrescar la lista
      await get().fetchUnlockedBadges();

      return result;
    } catch (error: unknown) {
      console.error('Error adding XP:', error);
      return null;
    }
  },

  updateStreak: async () => {
    try {
      await api.post('/gamification/streak');
      await get().fetchProgress();
    } catch (error: unknown) {
      console.error('Error updating streak:', error);
    }
  },

  reset: () => {
    set({
      progress: null,
      badges: [],
      unlockedBadges: [],
      loading: false,
      error: null,
    });
  },
}));
