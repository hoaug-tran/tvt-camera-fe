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

interface User {
  username: string;
  userId?: string;
  displayName?: string;
  role: "admin" | "user";
}

export type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  User,
};
