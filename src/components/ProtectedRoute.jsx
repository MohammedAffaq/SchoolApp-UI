import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const currentUser = localStorage.getItem('currentUser');
  const userRole = localStorage.getItem('userRole');

  // Check if user is logged in
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'student':
        return <Navigate to="/student" />;
      case 'teacher':
        return <Navigate to="/teacher" />;
      case 'parent':
        return <Navigate to="/parent" />;
      case 'staff':
        return <Navigate to="/staff" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return children;
}
