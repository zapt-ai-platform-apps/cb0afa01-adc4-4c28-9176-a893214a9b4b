import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import LoginPage from '@/modules/auth/pages/LoginPage';
import RegisterPage from '@/modules/auth/pages/RegisterPage';
import DashboardLayout from '@/modules/core/layouts/DashboardLayout';
import HomePage from '@/modules/core/pages/HomePage';
import ProjectsPage from '@/modules/projects/pages/ProjectsPage';
import ProjectBoardPage from '@/modules/projects/pages/ProjectBoardPage';
import TimelinePage from '@/modules/projects/pages/TimelinePage';
import ResourcePlannerPage from '@/modules/resources/pages/ResourcePlannerPage';
import TimeTrackingPage from '@/modules/timetracking/pages/TimeTrackingPage';
import ReportsPage from '@/modules/reports/pages/ReportsPage';
import AdminPage from '@/modules/admin/pages/AdminPage';
import OKRPage from '@/modules/okr/pages/OKRPage';
import AutomationPage from '@/modules/automation/pages/AutomationPage';
import UserSettingsPage from '@/modules/users/pages/UserSettingsPage';
import NotFoundPage from '@/modules/core/pages/NotFoundPage';
import { ZaptBadge } from '@/modules/core/components/ZaptBadge';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <ZaptBadge />
      
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectBoardPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/resources" element={<ResourcePlannerPage />} />
          <Route path="/time" element={<TimeTrackingPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/okr" element={<OKRPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}