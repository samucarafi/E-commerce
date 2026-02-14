import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/Auth/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAdmin } = useAuth();

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
