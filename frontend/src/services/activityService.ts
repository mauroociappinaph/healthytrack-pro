import { api } from './api';

// Types
export interface Walk {
  id: string;
  duration: number;
  distance?: number;
  intensity: 'low' | 'medium' | 'high';
  date: string;
  notes?: string;
}

export interface HomeExercise {
  id: string;
  type: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  date: string;
  notes?: string;
}

export interface GymSession {
  id: string;
  name: string;
  date: string;
  duration?: number;
  notes?: string;
  exercises?: GymExercise[];
}

export interface GymExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number;
  notes?: string;
}

export interface Meal {
  id: string;
  photoUrl?: string;
  description: string;
  calories?: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

// Walks
export const walksService = {
  async create(data: Partial<Walk>) {
    const response = await api.post('/walks', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/walks', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/walks/stats', { params: { startDate, endDate } });
    return response.data;
  },
  async delete(id: string) {
    await api.delete(`/walks/${id}`);
  },
};

// Home Exercises
export const homeExercisesService = {
  async create(data: Partial<HomeExercise>) {
    const response = await api.post('/home-exercises', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/home-exercises', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/home-exercises/stats', { params: { startDate, endDate } });
    return response.data;
  },
  async delete(id: string) {
    await api.delete(`/home-exercises/${id}`);
  },
};

// Gym
export const gymService = {
  async createSession(data: Partial<GymSession>) {
    const response = await api.post('/gym/sessions', data);
    return response.data;
  },
  async getSessions(startDate?: string, endDate?: string) {
    const response = await api.get('/gym/sessions', { params: { startDate, endDate } });
    return response.data;
  },
  async getSession(id: string) {
    const response = await api.get(`/gym/sessions/${id}`);
    return response.data;
  },
  async addExercise(sessionId: string, data: Partial<GymExercise>) {
    const response = await api.post(`/gym/sessions/${sessionId}/exercises`, data);
    return response.data;
  },
  async getProgress(exerciseName: string, limit = 10) {
    const response = await api.get(`/gym/progress/${exerciseName}`, { params: { limit } });
    return response.data;
  },
  async deleteSession(id: string) {
    await api.delete(`/gym/sessions/${id}`);
  },
};

// Meals
export const mealsService = {
  async create(data: Partial<Meal>) {
    const response = await api.post('/meals', data);
    return response.data;
  },
  async getAll(startDate?: string, endDate?: string) {
    const response = await api.get('/meals', { params: { startDate, endDate } });
    return response.data;
  },
  async getStats(startDate?: string, endDate?: string) {
    const response = await api.get('/meals/stats', { params: { startDate, endDate } });
    return response.data;
  },
  async delete(id: string) {
    await api.delete(`/meals/${id}`);
  },
};
