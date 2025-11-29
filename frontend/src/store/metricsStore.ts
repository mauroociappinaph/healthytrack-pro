import { create } from 'zustand';
import {
  sleepService,
  stressService,
  heartMetricsService,
  energyService,
  type Sleep,
  type Stress,
  type HeartMetric,
  type Energy,
} from '../services/healthService';

interface MetricsStore {
  sleep: Sleep[];
  stress: Stress[];
  heartMetrics: HeartMetric[];
  energy: Energy[];
  isLoading: boolean;

  // Sleep
  fetchSleep: (startDate?: string, endDate?: string) => Promise<void>;
  addSleep: (data: Partial<Sleep>) => Promise<void>;

  // Stress
  fetchStress: (startDate?: string, endDate?: string) => Promise<void>;
  addStress: (data: Partial<Stress>) => Promise<void>;

  // Heart Metrics
  fetchHeartMetrics: (startDate?: string, endDate?: string) => Promise<void>;
  addHeartMetric: (data: Partial<HeartMetric>) => Promise<void>;
  getHeartAnalysis: () => Promise<{ avgRhr: number; avgHrv: number; trend: string }>;

  // Energy
  fetchEnergy: (startDate?: string, endDate?: string) => Promise<void>;
  addEnergy: (data: Partial<Energy>) => Promise<void>;
}

export const useMetricsStore = create<MetricsStore>((set) => ({
  sleep: [],
  stress: [],
  heartMetrics: [],
  energy: [],
  isLoading: false,

  // Sleep
  fetchSleep: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const sleep = await sleepService.getAll(startDate, endDate);
    set({ sleep, isLoading: false });
  },

  addSleep: async (data: Partial<Sleep>) => {
    const sleep = await sleepService.create(data);
    set((state) => ({ sleep: [sleep, ...state.sleep] }));
  },

  // Stress
  fetchStress: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const stress = await stressService.getAll(startDate, endDate);
    set({ stress, isLoading: false });
  },

  addStress: async (data: Partial<Stress>) => {
    const stress = await stressService.create(data);
    set((state) => ({ stress: [stress, ...state.stress] }));
  },

  // Heart Metrics
  fetchHeartMetrics: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const heartMetrics = await heartMetricsService.getAll(startDate, endDate);
    set({ heartMetrics, isLoading: false });
  },

  addHeartMetric: async (data: Partial<HeartMetric>) => {
    const metric = await heartMetricsService.create(data);
    set((state) => ({ heartMetrics: [metric, ...state.heartMetrics] }));
  },

  getHeartAnalysis: async () => {
    return await heartMetricsService.getAnalysis();
  },

  // Energy
  fetchEnergy: async (startDate?: string, endDate?: string) => {
    set({ isLoading: true });
    const energy = await energyService.getAll(startDate, endDate);
    set({ energy, isLoading: false });
  },

  addEnergy: async (data: Partial<Energy>) => {
    const energy = await energyService.create(data);
    set((state) => ({ energy: [energy, ...state.energy] }));
  },
}));
