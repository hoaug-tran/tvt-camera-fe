interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  role: string;
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
    role: string;
  };
}

interface User {
  userId?: string | number;
  username: string;
  displayName?: string;
  // TODO: Cần xoá trong tương lai
  role: "admin" | "user";
}

export type { LoginRequest, LoginResponse, RefreshResponse, User };
