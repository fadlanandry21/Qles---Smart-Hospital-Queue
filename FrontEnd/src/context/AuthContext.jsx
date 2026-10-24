import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ADMIN_AUTHORIZED_EMAIL,
  ADMIN_AUTHORIZED_PASSWORD,
  verifyAdminCredentials,
  createAdminSession,
  validateAdminSession,
  getBruteForceStatus,
  recordFailedAdminLogin,
  resetBruteForceTracker
} from '../utils/security';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export const ADMIN_CREDENTIALS = {
  email: ADMIN_AUTHORIZED_EMAIL,
  name: 'Administrator RS Qless',
  role: 'admin',
  department: 'Loket Pendaftaran & Pelayanan Antrean RS'
};

export function AuthProvider({ children }) {
  // 1. Separate Patient User State (Persisted in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qless_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 2. Separate Secure Admin State (Stored in sessionStorage with Cryptographic Signature & TTL)
  const [admin, setAdmin] = useState(() => {
    try {
      localStorage.removeItem('qless_admin');

      const savedAdminRaw = sessionStorage.getItem('qless_admin_session');
      if (!savedAdminRaw) return null;

      const parsed = JSON.parse(savedAdminRaw);
      const validated = validateAdminSession(parsed);
      if (!validated) {
        sessionStorage.removeItem('qless_admin_session');
        return null;
      }
      return validated;
    } catch {
      sessionStorage.removeItem('qless_admin_session');
      return null;
    }
  });

  // Sync Patient to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('qless_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qless_user');
    }
  }, [user]);

  // Sync Admin to sessionStorage
  useEffect(() => {
    if (admin) {
      sessionStorage.setItem('qless_admin_session', JSON.stringify(admin));
    } else {
      sessionStorage.removeItem('qless_admin_session');
      localStorage.removeItem('qless_admin');
    }
  }, [admin]);

  // Periodic Session TTL Check (Every 15 seconds)
  useEffect(() => {
    if (!admin) return;

    const interval = setInterval(() => {
      const valid = validateAdminSession(admin);
      if (!valid) {
        console.warn('[Security Guard] Admin session expired or invalidated. Logging out.');
        setAdmin(null);
        sessionStorage.removeItem('qless_admin_session');
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [admin]);

  // --- UNIFIED AUTH METHOD (Admin & Patient) ---
  const login = useCallback(async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Try real BackEnd Laravel login API first
    try {
      const res = await authApi.login(cleanEmail, cleanPassword);
      if (res && res.success && res.user) {
        const loggedUser = res.user;

        // Check if user is admin
        if (loggedUser.role === 'admin' || cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
          resetBruteForceTracker();
          const signedSession = createAdminSession(cleanEmail, loggedUser);
          setAdmin(signedSession);
          setUser(null);
          sessionStorage.setItem('qless_admin_session', JSON.stringify(signedSession));

          return {
            success: true,
            role: 'admin',
            admin: signedSession,
            redirect: '/admin'
          };
        } else {
          // Regular patient
          setUser(loggedUser);
          setAdmin(null);
          sessionStorage.removeItem('qless_admin_session');

          return {
            success: true,
            role: 'patient',
            user: loggedUser,
            redirect: '/'
          };
        }
      }
    } catch (apiErr) {
      console.warn('API login request error:', apiErr);
      if (apiErr?.data?.message) {
        return {
          success: false,
          error: apiErr.data.message
        };
      }
    }

    // 2. Client-side fallback check (for admin@mail.com / admin123)
    if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      const bfStatus = getBruteForceStatus();
      if (bfStatus.isLocked) {
        return {
          success: false,
          role: 'admin',
          isLocked: true,
          error: `Akses ditolak: Akun administrator terkunci sementara. Coba lagi dalam ${bfStatus.remainingSeconds || 900} detik.`
        };
      }

      const isValidAdmin = verifyAdminCredentials(cleanEmail, cleanPassword);
      if (isValidAdmin) {
        resetBruteForceTracker();
        const signedSession = createAdminSession(cleanEmail);
        setAdmin(signedSession);
        setUser(null);
        sessionStorage.setItem('qless_admin_session', JSON.stringify(signedSession));

        return {
          success: true,
          role: 'admin',
          admin: signedSession,
          redirect: '/admin'
        };
      }

      const attemptResult = recordFailedAdminLogin();
      return {
        success: false,
        role: 'admin',
        error: `Kata sandi administrator salah! Sisa percobaan: ${attemptResult.remainingAttempts} kali.`
      };
    }

    // Patient fallback
    return {
      success: false,
      error: 'Alamat email atau kata sandi tidak sesuai'
    };
  }, []);

  const register = useCallback(async (formData) => {
    const cleanEmail = formData.email.trim().toLowerCase();

    if (cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: 'Email ini diproteksi khusus untuk Administrator Rumah Sakit.'
      };
    }

    try {
      const res = await authApi.register({
        name: formData.name,
        email: cleanEmail,
        phone: formData.phone,
        nik: formData.nik,
        password: formData.password
      });

      if (res && res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (apiErr) {
      console.warn('API register error:', apiErr);
      if (apiErr?.data?.message) {
        return { success: false, error: apiErr.data.message };
      }
    }

    // Local fallback if API fails
    const newUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 8),
      name: formData.name,
      email: cleanEmail,
      phone: formData.phone || "0812-3344-5566",
      nik: formData.nik || "3171052408900001",
      role: "patient"
    };
    setUser(newUser);
    return { success: true, user: newUser };
  }, []);

  // Update profile for user (User edit data diri)
  const updateProfile = useCallback(async (profileData) => {
    if (!user) return { success: false, error: 'User belum login' };

    try {
      if (user.id && typeof user.id === 'number') {
        const res = await authApi.updateProfile(user.id, profileData);
        if (res && res.success && res.data) {
          setUser(res.data);
          return { success: true, user: res.data };
        }
      }
    } catch (apiErr) {
      console.warn('API updateProfile error:', apiErr);
    }

    // Merge in local state
    const updatedUser = {
      ...user,
      ...profileData
    };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('qless_user');
  }, []);

  const loginAdmin = useCallback((email, password) => {
    return login(email, password);
  }, [login]);

  const logoutAdmin = useCallback(() => {
    setAdmin(null);
    sessionStorage.removeItem('qless_admin_session');
    localStorage.removeItem('qless_admin');
  }, []);

  const isAdminAuthenticated = !!(admin && validateAdminSession(admin));

  return (
    <AuthContext.Provider
      value={{
        // Patient Auth
        user,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,

        // Admin Auth
        admin,
        loginAdmin,
        logoutAdmin,
        isAdminAuthenticated,
        ADMIN_CREDENTIALS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
