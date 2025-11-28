import React, { useEffect, useState } from 'react';
import { useReportsStore } from '../store/reportsStore';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { WeekNavigator } from '../components/reports/WeekNavigator';
import { exportToCSV } from '../utils/exportUtils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, AreaChart, Area, ComposedChart, Legend
} from 'recharts';

export const Reports: React.FC = () => {
  const { weeklyReport, weeklyDailySummaries, isLoading, fetchWeeklyReport, fetchWeeklyDailySummaries } = useReportsStore();

  // State for navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const currentWeek = getWeekNumber(currentDate);
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    fetchWeeklyReport(currentWeek, currentYear);
    fetchWeeklyDailySummaries(currentWeek, currentYear);
  }, [currentWeek, currentYear, fetchWeeklyReport, fetchWeeklyDailySummaries]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  const handleExport = () => {
    if (weeklyDailySummaries.length > 0) {
      const filename = `reporte_semana_${currentWeek}_${currentYear}.csv`;
      exportToCSV(weeklyDailySummaries, filename);
    }
  };

  if (isLoading && !weeklyReport) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Reportes</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Análisis detallado de tu progreso
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <WeekNavigator
              currentWeek={currentWeek}
              currentYear={currentYear}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              onCurrentWeek={handleCurrentWeek}
              isLoading={isLoading}
            />

            <button
              onClick={handleExport}
              disabled={isLoading || !weeklyDailySummaries.length}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              data-testid="export-csv-button"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div data-testid="report-card-activity">
            <Card title="Actividad Total">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                    {weeklyReport?.totalActiveMinutes || 0}
                    <span className="text-lg text-gray-500 ml-1">min</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Esta semana</p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-full">
                  <span className="text-2xl">🏃‍♂️</span>
                </div>
              </div>
            </Card>
          </div>

          <div data-testid="report-card-sleep">
            <Card title="Calidad de Sueño">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {weeklyReport?.avgSleepQuality?.toFixed(1) || 0}
                    <span className="text-lg text-gray-500 ml-1">/10</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Promedio: {weeklyReport?.avgSleepHours?.toFixed(1) || 0}h
                  </p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-full">
                  <span className="text-2xl">😴</span>
                </div>
              </div>
            </Card>
          </div>

          <div data-testid="report-card-gym">
            <Card title="Sesiones Gym">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                    {weeklyReport?.totalGymSessions || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entrenamientos</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full">
                  <span className="text-2xl">💪</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 1. Activity Breakdown (Stacked Bar) */}
          <div data-testid="chart-activity-breakdown">
            <Card title="Desglose de Actividad">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyDailySummaries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}
                      stroke="#6B7280"
                    />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                    />
                    <Legend />
                    <Bar dataKey="walkMinutes" name="Caminata" stackId="a" fill="#818cf8" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="exerciseMinutes" name="Ejercicio en Casa" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* 2. Sleep vs Stress (Composed Chart) */}
          <div data-testid="chart-sleep-stress">
            <Card title="Sueño vs Estrés">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weeklyDailySummaries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}
                      stroke="#6B7280"
                    />
                    <YAxis yAxisId="left" stroke="#818cf8" label={{ value: 'Horas', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#f87171" label={{ value: 'Nivel', angle: 90, position: 'insideRight' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sleepHours" name="Horas de Sueño" fill="#818cf8" barSize={20} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="stressLevel" name="Nivel de Estrés" stroke="#f87171" strokeWidth={3} dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* 3. Heart Health Trends (Area Chart) */}
          <div data-testid="chart-heart-health">
            <Card title="Tendencias Cardíacas (RHR & HRV)">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyDailySummaries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRhr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHrv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}
                      stroke="#6B7280"
                    />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="rhr" name="RHR (Reposo)" stroke="#f472b6" fillOpacity={1} fill="url(#colorRhr)" />
                    <Area type="monotone" dataKey="hrv" name="HRV (Variabilidad)" stroke="#60a5fa" fillOpacity={1} fill="url(#colorHrv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* 4. Calories (Simple Line) */}
          <div data-testid="chart-calories">
            <Card title="Calorías Quemadas">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyDailySummaries} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}
                      stroke="#6B7280"
                    />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric' })}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="totalCalories" name="Calorías" stroke="#fb923c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* Alerts & Insights */}
        {weeklyReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div data-testid="report-alerts">
              <Card title="Alertas Detectadas" className="border-l-4 border-l-yellow-500">
                <div className="space-y-4">
                  {!weeklyReport.fatigueDetected && !weeklyReport.stressDetected && !weeklyReport.lowEnergyDetected && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <span className="text-2xl mr-3">✅</span>
                      <p>No se han detectado alertas esta semana.</p>
                    </div>
                  )}
                  {weeklyReport.fatigueDetected && (
                    <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-2xl mr-3">⚠️</span>
                      <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-200">Fatiga Detectada</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Tu frecuencia cardíaca en reposo ha aumentado.</p>
                      </div>
                    </div>
                  )}
                  {weeklyReport.stressDetected && (
                    <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-2xl mr-3">🧘</span>
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">Estrés Elevado</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Tu variabilidad cardíaca (HRV) ha disminuido.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div data-testid="report-recommendations">
              <Card title="Recomendaciones IA" className="border-l-4 border-l-primary-500">
                 {(() => {
                  try {
                    const recs = typeof weeklyReport.recommendations === 'string'
                      ? JSON.parse(weeklyReport.recommendations)
                      : weeklyReport.recommendations;

                    if (!recs || recs.length === 0) return <p className="text-gray-500">Sin recomendaciones por ahora.</p>;

                    return (
                      <ul className="space-y-3">
                        {recs.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-500 mr-2 mt-1">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  } catch (e) {
                    return <p className="text-gray-500">Error cargando recomendaciones.</p>;
                  }
                })()}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
