import { api } from './api';

export interface DailySummary {
  id: string;
  date: string;
  walkMinutes: number;
  exerciseMinutes: number;
  gymSessions: number;
  totalCalories?: number;
  sleepHours?: number;
  sleepQuality?: number;
  stressLevel?: number;
  energyLevel?: number;
  rhr?: number;
  hrv?: number;
}

export interface WeeklyReport {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  totalCalories?: number;
  totalActiveMinutes: number;
  avgSleepHours?: number;
  avgSleepQuality?: number;
  avgStress?: number;
  avgEnergy?: number;
  avgRhr?: number;
  avgHrv?: number;
  totalGymSessions: number;
  recommendations: string [];
  fatigueDetected: boolean;
  stressDetected: boolean;
  lowEnergyDetected: boolean;
  noProgressDetected: boolean;
}

export const reportsService = {
  async getDailySummary(date?: string) {
    const response = await api.get('/reports/daily', { params: { date } });
    return response.data as DailySummary;
  },

  async generateDailySummary(date?: string) {
    const response = await api.post('/reports/daily/generate', { date });
    return response.data as DailySummary;
  },

  async getWeeklyReport(weekNumber?: number, year?: number) {
    const response = await api.get('/reports/weekly', { params: { weekNumber, year } });
    return response.data as WeeklyReport;
  },

  async generateWeeklyReport(weekNumber?: number, year?: number) {
    const response = await api.post('/reports/weekly/generate', { weekNumber, year });
    return response.data as WeeklyReport;
  },

  async getWeeklyDailySummaries(weekNumber?: number, year?: number) {
    const response = await api.get('/reports/weekly-daily', { params: { weekNumber, year } });
    return response.data as DailySummary[];
  },

  async getMonthlySummaries(month: number, year: number) {
    const response = await api.get('/reports/monthly', { params: { month, year } });
    return response.data as DailySummary[];
  },
};
