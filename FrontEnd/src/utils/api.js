/**
 * Qless - API Service Utility
 * Connects FrontEnd React to BackEnd Laravel
 * Base URL: http://127.0.0.1:8000/api
 */

const API_BASE = 'http://127.0.0.1:8000/api/v1';
const API_AUTH = 'http://127.0.0.1:8000/api/v1/auth';

// ─── Generic Fetch Helper ────────────────────────────────────────────────────

async function apiFetch(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('qless_api_token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email, password) =>
    apiFetch(`${API_AUTH}/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (formData) =>
    apiFetch(`${API_AUTH}/register`, {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  updateProfile: (userId, profileData) =>
    apiFetch(`${API_AUTH}/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// ─── Departments (Poliklinik) ─────────────────────────────────────────────────

export const departmentsApi = {
  getAll: () => apiFetch(`${API_BASE}/departments`),
  getBySlug: (slug) => apiFetch(`${API_BASE}/departments/${slug}`),
};

// ─── Doctors ─────────────────────────────────────────────────────────────────

export const doctorsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`${API_BASE}/doctors${query ? '?' + query : ''}`);
  },
  getById: (id) => apiFetch(`${API_BASE}/doctors/${id}`),
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`${API_BASE}/appointments${query ? '?' + query : ''}`);
  },
  search: (q) => apiFetch(`${API_BASE}/appointments/search?q=${encodeURIComponent(q)}`),
  create: (data) =>
    apiFetch(`${API_BASE}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Queue / Antrean ─────────────────────────────────────────────────────────

export const queueApi = {
  getAll: () => apiFetch(`${API_BASE}/queues`),
  advance: (clinicId) =>
    apiFetch(`${API_BASE}/queues/${clinicId}/advance`, { method: 'POST' }),
};

// ─── Admin Queue Actions ──────────────────────────────────────────────────────

export const adminApi = {
  // Accept/validate ticket (pending → waiting)
  acceptTicket: (id) =>
    apiFetch(`${API_BASE}/admin/appointments/${id}/accept`, { method: 'POST' }),

  // Call patient (waiting → called, increments call_count)
  callPatient: (id) =>
    apiFetch(`${API_BASE}/admin/appointments/${id}/call`, { method: 'POST' }),

  // Mark serving (called → serving)
  servePatient: (id) =>
    apiFetch(`${API_BASE}/admin/appointments/${id}/serve`, { method: 'POST' }),

  // Complete consultation (serving → completed)
  completeTicket: (id) =>
    apiFetch(`${API_BASE}/admin/appointments/${id}/complete`, { method: 'POST' }),

  // Cancel/reject ticket
  cancelTicket: (id, reason) =>
    apiFetch(`${API_BASE}/admin/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // Get all appointments with filters
  getTickets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`${API_BASE}/admin/appointments${query ? '?' + query : ''}`);
  },

  // Add doctor
  addDoctor: (data) =>
    apiFetch(`${API_BASE}/admin/doctors`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Delete doctor
  deleteDoctor: (id) =>
    apiFetch(`${API_BASE}/admin/doctors/${id}`, { method: 'DELETE' }),

  // Dashboard statistics
  getStats: () => apiFetch(`${API_BASE}/admin/stats`),
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactApi = {
  send: (data) =>
    apiFetch(`${API_BASE}/contact`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export default {
  auth: authApi,
  departments: departmentsApi,
  doctors: doctorsApi,
  appointments: appointmentsApi,
  queue: queueApi,
  admin: adminApi,
  contact: contactApi,
};
