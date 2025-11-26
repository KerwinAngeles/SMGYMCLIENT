import type { AuthResponse, AuthRequest, RegisterRequest } from "@/features/auth/types";
import { tokenStorage } from "@/features/auth/services/tokenStorage";
import { config } from "@/config/environment";
import api from "@/services/api";

const API = config.apiUrl;
let refreshPromise: Promise<AuthResponse> | null = null;

function setupAxiosInterceptors() {
  api.interceptors.request.use((config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await refreshTokens();
          const newToken = tokenStorage.getToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          tokenStorage.clearTokens();
          window.dispatchEvent(new CustomEvent('auth:logout'));
        }
      }
      return Promise.reject(error);
    }
  );
}

async function login(credentials: AuthRequest){
    try {
        const response = await api.post(`${API}/Account/Authenticate`, credentials);
        tokenStorage.setTokens(response.data.jwToken, response.data.refreshToken);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function register(credentials: RegisterRequest) {
    try {
        const response = await api.post(`${API}/Account/RegisterAdministrator`, credentials);
        tokenStorage.setTokens(response.data.jwToken, response.data.refreshToken);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function registerStaff(credentials: RegisterRequest) {
  try {
    const response = await api.post(`${API}/Account/RegisterStaff`, credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function refreshTokens() {
  if (refreshPromise) return refreshPromise;

  const jwToken = tokenStorage.getToken();
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken || !jwToken) throw new Error('No refresh token or token available');

  refreshPromise = perfomRefresh(jwToken, refreshToken);
  try {
    const response = await refreshPromise;
    tokenStorage.setTokens(response.jwToken, response.refreshToken);
    return response;
  } finally {
    refreshPromise = null;
  }
}

async function perfomRefresh(jwToken: string, refreshToken: string) {
  const response = await api.post(`${API}/Account/RefreshToken`, { jwToken, refreshToken });
  return response.data;
}

async function logout() {
  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      // Set a timeout for the logout request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      await api.post(`${API}/Account/Logout`,
        { refreshToken },
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
    }
  } catch (e: any) {
    console.error('Logout failed:', e);
    
    // Handle different types of errors
    if (e.name === 'AbortError') {
      console.warn('Logout request timed out');
    } else if (e.response?.status === 401) {
      console.warn('User already logged out on server');
    } else if (e.response?.status >= 500) {
      console.error('Server error during logout');
    } else {
      console.error('Network or other error during logout');
    }
    
    // Re-throw the error so the UI can handle it appropriately
    throw e;
  } finally {
    // Always clear tokens, even if server logout failed
    tokenStorage.clearTokens();
  }
}

function hasValidToken() {
  const token = tokenStorage.getToken();
  return token !== null && !tokenStorage.isTokenExpired();
}

async function getCurrentUser() {
  const response = await api.get(`${API}/Account/GetUserAuthenticate`);
  return response.data;
}

setupAxiosInterceptors();

export const authService = {
  login,
  register,
  refreshTokens,
  logout,
  hasValidToken,
  getCurrentUser,
  registerStaff
};