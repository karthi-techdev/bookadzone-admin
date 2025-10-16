import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../components/stores/AuthStore';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuthStore();

  // Check if user is authenticated by checking if user exists or token exists in localStorage
  const isAuthenticated = !!user || !!localStorage.getItem('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;