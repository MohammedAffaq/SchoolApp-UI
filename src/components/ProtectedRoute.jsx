import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { validateAuth } from "../utils/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();

  const currentUser = localStorage.getItem("currentUser");
  const userRole = localStorage.getItem("userRole");

  console.log("ProtectedRoute Debug:", {
    path: location.pathname,
    currentUser: !!currentUser,
    userRole,
    requiredRole,
  });

  // 🚨 DO NOT protect public routes
  if (location.pathname === "/login" || location.pathname === "/") {
    return children;
  }

  // 🔐 Not logged in
  if (!currentUser) {
    console.log("No currentUser → redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  // 🔍 Validate auth (TEMPORARILY SAFE-GUARDED)
  let authValidation = { isValid: true };
  try {
    authValidation = validateAuth();
  } catch (e) {
    console.error("validateAuth crashed:", e);
  }

  if (!authValidation?.isValid) {
    console.log("Auth invalid → clearing storage and redirecting");
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 🔑 Role check
  if (requiredRole && userRole !== requiredRole) {
    console.log("Role mismatch → redirecting");

    const roleRoutes = {
      admin: "/admin",
      student: "/student",
      teacher: "/teacher",
      parent: "/parent",
      staff: "/staff",
    };

    return <Navigate to={roleRoutes[userRole] || "/login"} replace />;
  }

  return children;
}
