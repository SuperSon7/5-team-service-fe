import { create } from "zustand";

type AuthState = {
  accessToken: string | null;
  initialized: boolean;
  setAccessToken: (token: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  initialized: false,
  setAccessToken: (accessToken) => set({ accessToken: accessToken }),
  setInitialized: (initialized) => set({ initialized }),
  clear: () => set({ accessToken: null }),
}));

export const authStore = {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token: string | null) => useAuthStore.getState().setAccessToken(token),
  setInitialized: (initialized: boolean) => useAuthStore.getState().setInitialized(initialized),
  clear: () => useAuthStore.getState().clear(),
};
