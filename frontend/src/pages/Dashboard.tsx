import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReportsStore } from '../store/reportsStore';
import { Card } from '../components/ui/Card';
import { CardSkeleton, CircleChartSkeleton } from '../components/ui/SkeletonLoader';
import { RemindersPanel } from '../components/dashboard/RemindersPanel';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100
    }
  }
};

const counterVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15
    }
  }
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { dailySummary, isLoading, fetchDailySummary } = useReportsStore();

  useEffect(() => {
    fetchDailySummary();
  }, [fetchDailySummary]);

  const totalActiveMinutes = (dailySummary?.walkMinutes || 0) + (dailySummary?.exerciseMinutes || 0);
  const goalMinutes = 60;
  const goalPercentage = Math.min((totalActiveMinutes / goalMinutes) * 100, 100);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <CircleChartSkeleton />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <CircleChartSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Welcome Section */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Mi Dashboard</h1>
        <p className="text-gray-500">Hola! Vamos a ver qué hay de nuevo!</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {/* Active Minutes Card */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-testid="metrics-active-minutes">
              <Card>
                <div>
                  <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">Perfiles</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">Activos</p>
                  <p className="text-sm text-gray-500 mb-4">Minutos de actividad hoy</p>
                  <div className="flex items-baseline">
                    <motion.span
                      className="text-4xl font-bold text-gray-900"
                      variants={counterVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {totalActiveMinutes}
                    </motion.span>
                    <span className="text-gray-500 ml-2">Minutos</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Calories Card */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-testid="metrics-calories">
              <Card>
                <div>
                  <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">Perfiles</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">Calorías</p>
                  <p className="text-sm text-gray-500 mb-4">Quemadas hoy</p>
                  <div className="flex items-baseline">
                    <motion.span
                      className="text-4xl font-bold text-gray-900"
                      variants={counterVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {dailySummary?.totalCalories || 0}
                    </motion.span>
                    <span className="text-gray-500 ml-2">kcal</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Goal Progress Card */}
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} data-testid="metrics-goal-progress">
              <Card>
                <div>
                  <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">Estadísticas</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">Meta Diaria</p>
                  <p className="text-sm text-gray-500 mb-4">Progreso de actividad</p>
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          className="text-primary-600"
                          strokeLinecap="round"
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - goalPercentage / 100) }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                          className="text-2xl font-bold text-gray-900"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, type: 'spring' }}
                        >
                          {Math.round(goalPercentage)}%
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Charts Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
          >
            {/* Activity Distribution */}
            <motion.div variants={itemVariants}>
              <Card title="Distribución de Actividad">
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        className="text-gray-200"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        className="text-primary-600"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 80 * 0.4 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className="text-4xl font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        {totalActiveMinutes}
                      </motion.span>
                      <span className="text-sm text-gray-500">Minutos</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="space-y-2 mt-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-600 mr-2"></div>
                      <span className="text-sm text-gray-700">Caminata</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.walkMinutes || 0}m</span>
                  </motion.div>
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-400 mr-2"></div>
                      <span className="text-sm text-gray-700">Ejercicio</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.exerciseMinutes || 0}m</span>
                  </motion.div>
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary-200 mr-2"></div>
                      <span className="text-sm text-gray-700">Gimnasio</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.gymSessions || 0} sesiones</span>
                  </motion.div>
                </motion.div>
              </Card>
            </motion.div>

            {/* Sleep Quality */}
            <motion.div variants={itemVariants}>
              <Card title="Calidad de Sueño">
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        className="text-gray-200"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="80"
                        stroke="currentColor"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        className="text-indigo-600"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - (dailySummary?.sleepQuality || 0) / 10) }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        className="text-4xl font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                      >
                        {dailySummary?.sleepHours?.toFixed(1) || 0}
                      </motion.span>
                      <span className="text-sm text-gray-500">Horas</span>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="space-y-2 mt-4"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <span className="text-sm text-gray-700">Calidad</span>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.sleepQuality || 0}/10</span>
                  </motion.div>
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <span className="text-sm text-gray-700">Energía</span>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.energyLevel || 0}/10</span>
                  </motion.div>
                  <motion.div className="flex items-center justify-between" variants={itemVariants}>
                    <span className="text-sm text-gray-700">Estrés</span>
                    <span className="text-sm font-semibold text-gray-900">{dailySummary?.stressLevel || 0}/10</span>
                  </motion.div>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Acciones Rápidas</h3>
                  <p className="text-sm text-gray-500">Registra tu actividad del día</p>
                </div>
                <motion.button
                  onClick={() => navigate('/activity-hub')}
                  className="bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  + Registrar Actividad
                </motion.button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar - Reminders Panel */}
        <motion.div
          className="lg:col-span-1"
          variants={itemVariants}
        >
          <RemindersPanel />
        </motion.div>
      </div>
    </motion.div>
  );
};
