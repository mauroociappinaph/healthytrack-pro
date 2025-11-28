import { create } from 'zustand';
import { reportsService, type DailySummary, type WeeklyReport } from '../services/reportsService';

interface ReportsStore {
  dailySummary: DailySummary | null;
  weeklyReport: WeeklyReport | null;
  weeklyDailySummaries: DailySummary[];
  isLoading: boolean;

  fetchDailySummary: (date?: string) => Promise<void>;
  fetchWeeklyReport: (weekNumber?: number, year?: number) => Promise<void>;
  fetchWeeklyDailySummaries: (weekNumber?: number, year?: number) => Promise<void>;
  generateWeeklyReport: (weekNumber?: number, year?: number) => Promise<void>;
}

export const useReportsStore = create<ReportsStore>((set) => ({
  dailySummary: null,
  weeklyReport: null,
  weeklyDailySummaries: [],
  isLoading: false,

  fetchDailySummary: async (date?: string) => {
    set({ isLoading: true });
    const dailySummary = await reportsService.getDailySummary(date);
    set({ dailySummary, isLoading: false });
  },

 fetchWeeklyReport: async (weekNumber?: number, year?: number) => {
    set({ isLoading: true });
    const weeklyReport = await reportsService.getWeeklyReport(weekNumber, year);
    set({ weeklyReport, isLoading: false });
  },

  fetchWeeklyDailySummaries: async (weekNumber?: number, year?: number) => {
    set({ isLoading: true });
    const summaries = await reportsService.getWeeklyDailySummaries(weekNumber, year);
    set({ weeklyDailySummaries: summaries, isLoading: false });
  },

  generateWeeklyReport: async (weekNumber?: number, year?: number) => {
    set({ isLoading: true });
    const weeklyReport = await reportsService.generateWeeklyReport(weekNumber, year);
    set({ weeklyReport, isLoading: false });
  },
}));
