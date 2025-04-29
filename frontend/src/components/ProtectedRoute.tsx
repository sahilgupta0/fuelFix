
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./../contexts/AuthContext";
import React from 'react';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute = ({ redirectPath = "/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, isAuthLoaded } = useAuth();
  const location = useLocation();

  if (! isAuthLoaded) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    // Use state to remember where the user was trying to go
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
