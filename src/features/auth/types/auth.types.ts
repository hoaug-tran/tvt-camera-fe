export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  role: "admin" | "user";
  message: string;
  accessToken: string;
  expiresAt: string;
}

export interface User {
  username: string;
  userId?: string;
  displayName?: string;
  role: "admin" | "user";
}
