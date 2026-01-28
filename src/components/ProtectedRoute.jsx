import React from 'react';
import { Navigate } from 'react-router-dom';
import { validateAuth } from '../utils/auth';

export default function ProtectedRoute({ children, requiredRole }) {
  const currentUser = localStorage.getItem('currentUser');
  const userRole = localStorage.getItem('userRole');

  console.log('ProtectedRoute Debug:', { currentUser: !!currentUser, userRole, requiredRole });

  // Check if user is logged in
  if (!currentUser) {
    console.log('No currentUser, redirecting to /');
    return <Navigate to="/" />;
  }

  // Validate authentication and check for session expiration
  const authValidation = validateAuth();
  console.log('Auth validation:', authValidation);
  if (!authValidation.isValid) {
    console.log('Auth invalid, clearing session and redirecting');
    // Clear invalid session data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('parentName');
    localStorage.removeItem('childName');
    localStorage.removeItem('childGrade');
    return <Navigate to="/" />;
  }

  // Check role-based access
  if (requiredRole && userRole !== requiredRole) {
    console.log('Role mismatch, redirecting based on userRole');
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

  console.log('Returning children');
  return children;
}
