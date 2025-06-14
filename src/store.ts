import { create } from "zustand";
import { AuthUser } from "./types/form";

interface AuthState {
  user: null | AuthUser;
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
