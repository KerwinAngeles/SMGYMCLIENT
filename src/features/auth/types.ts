export interface User {
  name: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  user: User;
  jwToken: string;
  refreshToken: string;
}

export interface AuthRequest {
  userName: string;
  password: string;
}

export interface AuthResponse {
  name: string;
  userName: string;
  email: string;
  roles: string[];
  jwToken: string;
  refreshToken: string;
  success?: string
  error?: string
}


export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: AuthRequest) => Promise<void>;
  registerStaff: (credentials: RegisterRequest) => Promise<void>;
  registerAccount: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>
  hasRole: (role: string) => boolean;
  hasAnyRole: (role: string[]) => boolean;
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export const ContextInitialValues = {
  user: null,
  token: null,
  isLoading: false,
  login: async () => { },
  registerStaff: async () => { },
  registerAccount: async () => { },
  logout: () => { },
  refreshAuth: async () => { },
  hasRole: () => false,
  hasAnyRole: () => false
}
