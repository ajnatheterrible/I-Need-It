import { create } from "zustand";

export const useAuthStore = create((set) => ({
  currentUser: null, // Tracks the authenticated user
  loading: true, // Tracks whether Firebase is determining the user's auth state
  authLoading: false, // Tracks loading during login/signup specifically
  setUser: (user) => set({ currentUser: user }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setAuthLoading: (isLoading) => set({ authLoading: isLoading }), // New function for auth-specific loading
  clearUser: () => set({ currentUser: null }),
}));
