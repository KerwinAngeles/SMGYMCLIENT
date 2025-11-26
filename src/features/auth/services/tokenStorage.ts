let jwToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiresAt: number | null = null;

function setTokens(newToken: string, newRefreshToken: string): void {
  jwToken = newToken;
  refreshToken = newRefreshToken;

  const payload = parseJWT(newToken);
  if (payload?.exp) {
    tokenExpiresAt = payload.exp * 1000;
  }

  localStorage.setItem('jwToken', newToken);
  localStorage.setItem('refreshToken', newRefreshToken);
  localStorage.setItem('tokenExpiresAt', tokenExpiresAt?.toString() || '');
}

function getToken(): string | null {
  if (jwToken && isTokenExpired()) {
    clearTokens();
    return null;
  }
  return jwToken;
}

function getRefreshToken(): string | null {
  return refreshToken;
}

function clearTokens(): void {
  jwToken = null;
  refreshToken = null;
  tokenExpiresAt = null;

  localStorage.removeItem('jwToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
}

function isTokenExpired(): boolean {
  if (!tokenExpiresAt) return true;
  return Date.now() >= tokenExpiresAt - 30000;
}

function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function loadTokens(): void {
  const storedToken = localStorage.getItem('jwToken');
  const storedRefresh = localStorage.getItem('refreshToken');
  const expiresAt = localStorage.getItem('tokenExpiresAt');

  jwToken = storedToken;
  refreshToken = storedRefresh;
  tokenExpiresAt = expiresAt ? parseInt(expiresAt, 10) : null;
}

loadTokens();

export const tokenStorage = {
  setTokens,
  getToken,
  getRefreshToken,
  clearTokens,
  isTokenExpired,
};