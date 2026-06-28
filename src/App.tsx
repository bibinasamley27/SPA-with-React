/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import ViewTask from './pages/ViewTask';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
            <Routes>
              {/* Public Authentications */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  </PublicRoute>
                }
              />

              {/* Protected Workspace Layout Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AllTasks />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <CreateTask />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ViewTask />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id/edit"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EditTask />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              {/* Home & Utility Redirection routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TaskProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
