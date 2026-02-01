import { create } from "zustand";
import type { User } from "@features/auth/types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,

  login: (user, token) =>
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
