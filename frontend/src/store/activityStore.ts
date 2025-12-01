import { create } from 'zustand';
import {
  walksService,
  homeExercisesService,
  gymService,
  mealsService,
  type Walk,
  type HomeExercise,
  type GymSession,
  type Meal,
} from '../services/activityService';
import { useGamificationStore } from '../stores/gamificationStore';

interface ActivityStore {
  walks: Walk[];
  homeExercises: HomeExercise[];
  gymSessions: GymSession[];
  meals: Meal[];
  isLoading: boolean;

  // Walks
  fetchWalks: (startDate?: string, endDate?: string) => Promise<void>;
  addWalk: (data: Partial<Walk>) => Promise<void>;
  deleteWalk: (id: string) => Promise<void>;

  // Home Exercises
  fetchHomeExercises: (startDate?: string, endDate?: string) => Promise<void>;
  addHomeExercise: (data: Partial<HomeExercise>) => Promise<void>;
  deleteHomeExercise: (id: string) => Promise<void>;

  // Gym
  fetchGymSessions: (startDate?: string, endDate?: string) => Promise<void>;
  addGymSession: (data: Partial<GymSession>) => Promise<void>;
  deleteGymSession: (id: string) => Promise<void>;

  // Meals
  fetchMeals: (startDate?: string, endDate?: string) => Promise<void>;
  addMeal: (data: Partial<Meal>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  walks: [],
  homeExercises: [],
  gymSessions: [],
  meals: [],
  isLoading: false,

  // Walks
  fetchWalks: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const walks = await walksService.getAll(startDate, endDate);
    set({ walks, isLoading: false });
  },

  addWalk: async (data: Partial<Walk>) => {
    const walk = await walksService.create(data);
    set((state) => ({ walks: [walk, ...state.walks] }));

    // Award XP for workout
    useGamificationStore.getState().addXP(50, 'Caminata completada');
  },

  deleteWalk: async (id: string) => {
    await walksService.delete(id);
    set((state) => ({ walks: state.walks.filter((w) => w.id !== id) }));
  },

  // Home Exercises
  fetchHomeExercises: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const homeExercises = await homeExercisesService.getAll(startDate, endDate);
    set({ homeExercises, isLoading: false });
  },

  addHomeExercise: async (data: Partial<HomeExercise>) => {
    const exercise = await homeExercisesService.create(data);
    set((state) => ({ homeExercises: [exercise, ...state.homeExercises] }));

    // Award XP for workout
    useGamificationStore.getState().addXP(50, 'Ejercicio en casa completado');
  },

  deleteHomeExercise: async (id: string) => {
    await homeExercisesService.delete(id);
    set((state) => ({ homeExercises: state.homeExercises.filter((e) => e.id !== id) }));
  },

  // Gym
  fetchGymSessions: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const gymSessions = await gymService.getSessions(startDate, endDate);
    set({ gymSessions, isLoading: false });
  },

  addGymSession: async (data: Partial<GymSession>) => {
    const session = await gymService.createSession(data);
    set((state) => ({ gymSessions: [session, ...state.gymSessions] }));

    // Award XP for workout
    useGamificationStore.getState().addXP(50, 'Sesión de gimnasio completada');
  },

  deleteGymSession: async (id: string) => {
    await gymService.deleteSession(id);
    set((state) => ({ gymSessions: state.gymSessions.filter((s) => s.id !== id) }));
  },

  // Meals
  fetchMeals: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const meals = await mealsService.getAll(startDate, endDate);
    set({ meals, isLoading: false });
  },

  addMeal: async (data: Partial<Meal>) => {
    const meal = await mealsService.create(data);
    set((state) => ({ meals: [meal, ...state.meals] }));

    // Award XP for meal
    useGamificationStore.getState().addXP(20, 'Comida registrada');
  },

  deleteMeal: async (id: string) => {
    await mealsService.delete(id);
    set((state) => ({ meals: state.meals.filter((m) => m.id !== id) }));
  },
}));
