import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  permissions: null,

  setUser: (newUserData) =>
    set((state) => ({
      user: { ...state.user, ...newUserData },
    })),

  login: (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    set({
      user: userData,
      token,
      permissions: userData.permissions,
      isLoggedIn: true,
    });
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

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isLoggedIn: false,
    });
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const permissions = user?.permissions;

    if (token && user) {
      set({
        token,
        user,
        permissions,
        isLoggedIn: true,
      });
    }
  },
}));

export default useAuthStore;
