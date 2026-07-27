import { useState, useEffect, useCallback } from 'react';
import { adminApiService, getAuthToken, getStoredUser, AdminUser } from '../services/adminApiService';

export function useAdminAuth() {
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Validate existing token on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        if (isMounted) {
          setTokenState(null);
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const currentUser = await adminApiService.getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          setTokenState(storedToken);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setTokenState(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    checkAuth();

    // Listen for unauthorized 401 events
    const handleUnauthorized = () => {
      setTokenState(null);
      setUser(null);
      setError('Your session has expired. Please log in again.');
    };

    window.addEventListener('smilesync_unauthorized', handleUnauthorized);
    return () => {
      isMounted = false;
      window.removeEventListener('smilesync_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApiService.login(email, password);
      setTokenState(res.access_token);
      setUser(res.user);
      return res.user;
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    adminApiService.logout();
    setTokenState(null);
    setUser(null);
    setError(null);
  }, []);

  return {
    isAuthenticated: !!token && !!user,
    token,
    user,
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null),
  };
}
