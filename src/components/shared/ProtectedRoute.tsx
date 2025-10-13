import React, { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore(state => state.token);
  const location = useLocation();
  
  // Allow access to auth-related pages without token
  const authPathRegex = /\/(login|forgot-password|reset-password)/i;
  const isAuthPage = authPathRegex.test(location.pathname);
  
  if (!token && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
