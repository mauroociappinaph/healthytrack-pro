import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuthStore } from './store/authStore';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/ui/ToastContainer';
import { Spinner } from './components/ui/Spinner';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const ActivityHub = lazy(() => import('./pages/ActivityHub').then(module => ({ default: module.ActivityHub })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const Profile = lazy(() => import('./pages/Profile').then(module => ({ default: module.Profile })));
const Calendar = lazy(() => import('./pages/Calendar').then(module => ({ default: module.Calendar })));
const Walks = lazy(() => import('./pages/Walks').then(module => ({ default: module.Walks })));
const HomeExercises = lazy(() => import('./pages/HomeExercises').then(module => ({ default: module.HomeExercises })));
const Gym = lazy(() => import('./pages/Gym').then(module => ({ default: module.Gym })));
const Meals = lazy(() => import('./pages/Meals').then(module => ({ default: module.Meals })));
const Health = lazy(() => import('./pages/Health').then(module => ({ default: module.Health })));

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router>
        <Suspense fallback={<FullPageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route
                path="/dashboard"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
              <Route
                path="/activity-hub"
                element={
                  <Layout>
                    <ActivityHub />
                  </Layout>
                }
              />
              <Route
                path="/reports"
                element={
                  <Layout>
                    <Reports />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <Profile />
                  </Layout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <Layout>
                    <Calendar />
                  </Layout>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Activity Pages */}
              <Route
                path="/walks"
                element={
                  <Layout>
                    <Walks />
                  </Layout>
                }
              />
              <Route
                path="/home-exercises"
                element={
                  <Layout>
                    <HomeExercises />
                  </Layout>
                }
              />
              <Route
                path="/gym"
                element={
                  <Layout>
                    <Gym />
                  </Layout>
                }
              />
              <Route
                path="/meals"
                element={
                  <Layout>
                    <Meals />
                  </Layout>
                }
              />
              <Route
                path="/health"
                element={
                  <Layout>
                    <Health />
                  </Layout>
                }
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

export default App;
