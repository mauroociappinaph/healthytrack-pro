import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuthStore } from './store/authStore';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ActivityHub } from './pages/ActivityHub';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import { Calendar } from './pages/Calendar';
// Placeholder pages for now
import { Walks } from './pages/Walks';
import { HomeExercises } from './pages/HomeExercises';
import { Gym } from './pages/Gym';
import { Meals } from './pages/Meals';
import { Health } from './pages/Health';
import { ToastContainer } from './components/ui/ToastContainer';

const App: React.FC = () => {
  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <ThemeProvider>
      <ToastContainer />
      <Router>
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
    </Router>
    </ThemeProvider>
  );
};

export default App;
