import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { ExpenseGroupProvider } from './context/ExpenseGroupContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { GroupsPage } from './pages/GroupsPage';
import { CreateGroupPage } from './pages/CreateGroupPage';
import { GroupDetailPage } from './pages/GroupDetailPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { ActivityPage } from './pages/ActivityPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CollabInvitePage } from './pages/CollabInvitePage';
import { SoloTripPage } from './pages/SoloTripPage';
import { LandingPage } from './pages/LandingPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isLight ? '#f8fafc' : '#000000',
          gap: '16px',
        }}
      >
        <div className="skeleton" style={{ width: '140px', height: '14px', borderRadius: '9999px' }} />
        <div style={{ color: 'var(--accent-primary)', fontSize: '14px', fontWeight: 900 }}>
          Loading Split Money...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicAuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
}

function NotFoundRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <ExpenseGroupProvider>
                <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />

                {/* Public Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicAuthRoute>
                      <LoginPage />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicAuthRoute>
                      <RegisterPage />
                    </PublicAuthRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicAuthRoute>
                      <ForgotPasswordPage />
                    </PublicAuthRoute>
                  }
                />

                {/* Protected Application Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/groups" element={<GroupsPage />} />
                  <Route path="/groups/create" element={<CreateGroupPage />} />
                  <Route path="/create-group" element={<CreateGroupPage />} />
                  <Route path="/groups/:groupId" element={<GroupDetailPage />} />
                  <Route path="/settlements" element={<SettlementsPage />} />
                  <Route path="/activity" element={<ActivityPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/solo" element={<SoloTripPage />} />
                  <Route path="/personal-trips" element={<SoloTripPage />} />
                  <Route path="/collab/:groupId" element={<CollabInvitePage />} />
                  <Route path="/join/:groupId" element={<CollabInvitePage />} />
                </Route>

                {/* Catch-all: Any unknown or tempered URL redirects to home without showing 404 */}
                <Route path="*" element={<NotFoundRedirect />} />
              </Routes>
            </ExpenseGroupProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
