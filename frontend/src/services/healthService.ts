import { api } from './api';

// Types
export interface Sleep {
  id: string;
  hours: number;
  quality: number;
  date: string;
  notes?: string;
}

export interface Stress {
  id: string;
  level: number;
  date: string;
  notes?: string;
}

export interface HeartMetric {
  id: string;
  rhr?: number;
  hrv?: number;
  date: string;
  notes?: string;
}

export interface Energy {
  id: string;
  level: number;
  date: string;
  notes?: string;
}

// Sleep
export const sleepService = {
  async create(data: Partial<Sleep>) {
    const response = await api.post('/health/sleep', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/health/sleep', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/health/sleep/stats', { params: { startDate, endDate } });
    return response.data;
  },
};

// Stress
export const stressService = {
  async create(data: Partial<Stress>) {
    const response = await api.post('/health/stress', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/health/stress', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/health/stress/stats', { params: { startDate, endDate } });
    return response.data;
  },
};

// Heart Metrics
export const heartMetricsService = {
  async create(data: Partial<HeartMetric>) {
    const response = await api.post('/health/heart-metrics', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/health/heart-metrics', { params: { startDate, endDate } });
    return response.data;
  },
  async getAnalysis() {
    const response = await api.get('/health/heart-metrics/analysis');
    return response.data;
  },
};

// Energy
export const energyService = {
  async create(data: Partial<Energy>) {
    const response = await api.post('/health/energy', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/health/energy', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/health/energy/stats', { params: { startDate, endDate } });
    return response.data;
  },
};
