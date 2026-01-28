import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePasswordPage from "./pages/ChangePasswordPage";

import StudentDashboard from "./pages/StudentDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import ModernAdminDashboard from "./pages/ModernAdminDashboard";

import UserManagement from "./pages/UserManagement";
import StudentsPage from "./pages/StudentsPage";
import TeachersPage from "./pages/TeachersPage";
import ParentsPage from "./pages/ParentsPage";
import NotificationsPage from "./pages/NotificationsPage";
import AttendancePage from "./pages/AttendancePage";
import FinancePage from "./pages/FinancePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MaintenancePage from "./pages/MaintenancePage";
import DriversPage from "./pages/DriversPage";
import CalendarPage from "./pages/CalendarPage";
import Settings from "./pages/Settings";
import AdminProfilePage from "./pages/AdminProfilePage";

import { logout } from "./utils/auth";

function App() {
  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />

        {/* 🔐 PROTECTED ROUTES */}

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <ModernAdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfilePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute requiredRole="admin">
              <StudentsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teachers"
          element={
            <ProtectedRoute requiredRole="admin">
              <TeachersPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/parents"
          element={
            <ProtectedRoute requiredRole="admin">
              <ParentsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute requiredRole="admin">
              <NotificationsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute requiredRole="admin">
              <AttendancePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/finance"
          element={
            <ProtectedRoute requiredRole="admin">
              <FinancePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AnalyticsPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/maintenance"
          element={
            <ProtectedRoute requiredRole="admin">
              <MaintenancePage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/drivers"
          element={
            <ProtectedRoute requiredRole="admin">
              <DriversPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute requiredRole="admin">
              <Settings onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/calendar"
          element={
            <ProtectedRoute requiredRole="admin">
              <CalendarPage onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Parent */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute requiredRole="parent">
              <ParentDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Teacher */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <TeacherDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
