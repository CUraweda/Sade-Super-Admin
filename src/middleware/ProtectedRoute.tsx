// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { LoginStore } from "../store/Store"; // Adjust the import path

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { token, id } = LoginStore();
  const isAuthenticated = Boolean(token);
  console.log(token, isAuthenticated, id);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
