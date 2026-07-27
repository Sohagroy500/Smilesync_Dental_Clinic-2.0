import { Appointment, Patient, ChatSessionAdmin, DashboardSummary, ClinicSettings } from '../types';

const TOKEN_KEY = 'smilesync_admin_jwt_token';
const USER_KEY = 'smilesync_admin_user';

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): AdminUser | null => {
  const str = localStorage.getItem(USER_KEY);
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AdminUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Clear invalid token and notify auth state
    removeAuthToken();
    window.dispatchEvent(new Event('smilesync_unauthorized'));
  }

  return response;
}

export const adminApiService = {
  // Login Endpoint
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'Invalid credentials or server error.');
    }

    const data: LoginResponse = await res.json();
    setAuthToken(data.access_token);
    setStoredUser(data.user);
    return data;
  },

  // Verify / Get Current Profile
  async getCurrentUser(): Promise<AdminUser> {
    const res = await authFetch('/api/auth/me');
    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();
    setStoredUser(data.user);
    return data.user;
  },

  // Logout
  logout(): void {
    removeAuthToken();
    window.dispatchEvent(new Event('smilesync_unauthorized'));
  },

  // Protected REST Endpoints
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await authFetch('/api/dashboard');
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  async getAppointments(params?: { search?: string; status?: string; date?: string }): Promise<Appointment[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.date) query.set('date', params.date);

    const res = await authFetch(`/api/appointments?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  async getAppointmentById(id: number | string): Promise<Appointment> {
    const res = await authFetch(`/api/appointments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch appointment details');
    return res.json();
  },

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await authFetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  },

  async deleteAppointment(id: number): Promise<{ success: boolean }> {
    const res = await authFetch(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to cancel appointment');
    return res.json();
  },

  async createAppointment(data: Partial<Appointment>): Promise<{ success: boolean; appointment: Appointment }> {
    const res = await authFetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return res.json();
  },

  async getPatients(): Promise<Patient[]> {
    const res = await authFetch('/api/patients');
    if (!res.ok) throw new Error('Failed to fetch patients list');
    return res.json();
  },

  async getChatHistory(): Promise<ChatSessionAdmin[]> {
    const res = await authFetch('/api/chat-history');
    if (!res.ok) throw new Error('Failed to fetch chat history');
    return res.json();
  },

  async getSettings(): Promise<ClinicSettings> {
    const res = await authFetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch clinic settings');
    return res.json();
  },

  async updateSettings(settings: Partial<ClinicSettings>): Promise<{ success: boolean; settings: ClinicSettings }> {
    const res = await authFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  }
};
