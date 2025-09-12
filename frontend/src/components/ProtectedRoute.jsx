import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  console.log("🔥 ProtectedRoute triggered");
  console.log("Token:", token);
  console.log("Role:", role);

  if (!token || !role) {
    console.warn("⛔ Not logged in. Redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    console.warn("⛔ Role not authorized. Redirecting to home...");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
