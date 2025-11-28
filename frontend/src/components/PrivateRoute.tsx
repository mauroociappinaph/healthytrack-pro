import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>; // O usar el Spinner component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
