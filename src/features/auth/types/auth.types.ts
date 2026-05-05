interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  userId?: string;
  displayName?: string;
}

interface RefreshResponse {
  accessToken: string;
  expiresAt: string;
  user: {
    userId: string | number;
    username: string;
    displayName: string;
  };
}

interface User {
  userId?: string | number;
  username: string;
  displayName?: string;
}

export type { LoginRequest, LoginResponse, RefreshResponse, User };
