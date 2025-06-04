import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchFavorites() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useAuthStore((s) => s.user?._id);
  const setUser = useAuthStore((s) => s.setUser);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !userId || hasFetchedRef.current) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();

        setUser({ favorites: data.favorites || [] });

        setTimeout(() => {
          console.log(
            "🧠 Zustand now has:",
            useAuthStore.getState().user?.favorites
          );
        }, 300);

        hasFetchedRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, userId]);
}
