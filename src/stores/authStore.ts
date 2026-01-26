import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken: accessToken }),
  clear: () => set({ accessToken: null }),
}));

export const authStore = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token: string | null) => useAuthStore.getState().setAccessToken(token),
  clear: () => useAuthStore.getState().clear(),
};
