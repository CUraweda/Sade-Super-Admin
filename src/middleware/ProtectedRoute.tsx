// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { LoginStore } from "../store/Store";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token } = LoginStore();
  const isAuthenticated = Boolean(token);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
