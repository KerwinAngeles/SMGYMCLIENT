export const config = {
  apiUrl: import.meta.env.VITE_APP_API_URL,
  tokenRefreshThreshold: parseInt(import.meta.env.VITE_APP_TOKEN_REFRESH_THRESHOLD),
  sessionTimeout: parseInt(import.meta.env.VITE_APP_SESSION_TIMEOUT),
  debugAuth: import.meta.env.VITE_APP_DEBUG_AUTH === 'true',
  publicApiKey: import.meta.env.VITE_APP_PUBLIC_API || '',
};
