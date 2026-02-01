export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  expiresAt: string;
}

export interface User {
  username: string;
  userId?: string;
  displayName?: string;
  role: "admin" | "viewer";
}
