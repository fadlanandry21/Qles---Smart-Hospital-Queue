import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueueProvider } from './context/QueueContext';
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import QueueTrackerPage from './pages/QueueTrackerPage';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import AppointmentPage from './pages/AppointmentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

/**
 * Strict Admin Protected Route
 * If a regular patient (user) attempts to access /admin, immediately redirect to / (Home).
 * If unauthenticated, redirect to the unified /login page.
 */
function AdminProtectedRoute({ children }) {
  const { user, isAdminAuthenticated } = useAuth();

  // If logged in as patient, completely forbid access
  if (user && !isAdminAuthenticated) {
    return <Navigate to="/" replace state={{ accessDenied: true }} />;
  }

  // If not logged in as admin, redirect to unified login
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace state={{ fromAdmin: true }} />;
  }

  return children;
}

/**
 * Scroll to top of window automatically on route transition
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <Router>
      <AuthProvider>
        <QueueProvider>
          <ScrollToTop />
          <Routes>
            {/* Unified Auth route for both patient and admin */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />

            {/* Standard routes wrapped in floating pill navbar & hospital footer */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/about"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/doctors"
              element={
                <Layout>
                  <DoctorsPage />
                </Layout>
              }
            />
            <Route
              path="/queue"
              element={
                <Layout>
                  <QueueTrackerPage />
                </Layout>
              }
            />
            <Route
              path="/gallery"
              element={
                <Layout>
                  <GalleryPage />
                </Layout>
              }
            />
            <Route
              path="/blog"
              element={
                <Layout>
                  <BlogPage />
                </Layout>
              }
            />
            <Route
              path="/blog/:id"
              element={
                <Layout>
                  <BlogDetailPage />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/appointment"
              element={
                <Layout>
                  <AppointmentPage />
                </Layout>
              }
            />
            <Route
              path="/privacy"
              element={
                <Layout>
                  <PrivacyPage />
                </Layout>
              }
            />
            <Route
              path="/terms"
              element={
                <Layout>
                  <TermsPage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardPage />
                </AdminProtectedRoute>
              }
            />

            {/* Fallback to Home */}
            <Route
              path="*"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
          </Routes>
        </QueueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
