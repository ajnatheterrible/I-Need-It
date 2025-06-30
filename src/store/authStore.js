import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  hasRefreshed: false,

  setUser: (newUserData) =>
    set((s) => ({
      user: {
        ...s.user,
        ...newUserData,
      },
    })),

  login: (userData, newToken) => {
    set((s) => ({
      user: userData ?? s.user,
      token: newToken ?? s.token,
      isLoggedIn: true,
    }));
  },

  logout: async (req, res) => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to log out", err);
    }

    set({
      user: null,
      token: null,
      isLoggedIn: false,
      hasRefreshed: true,
    });
  },

  loadUserFromRefresh: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      set({
        user: data.user,
        token: data.accessToken,
        isLoggedIn: true,
        hasRefreshed: true,
      });
    } catch (err) {
      console.error("Could not refresh user:", err);

      set({
        user: null,
        token: null,
        isLoggedIn: false,
        hasRefreshed: true,
      });
    }
  },
}));

export default useAuthStore;
