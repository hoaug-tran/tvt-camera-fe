interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  role: string;
}

interface RefreshResponse {
  accessToken: string;
  expiresAt: string;
}

interface JwtPayload {
  dvr_id?: string;
  username?: string;
  type?: string;
  exp?: number;
}

interface User {
  username: string;
  userId?: string;
  displayName?: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  JwtPayload,
  User,
  AuthState,
};
