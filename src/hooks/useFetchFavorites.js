import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchFavorites() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedRef.current) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/favorites`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const favorites = await res.json();

        setUser({ favorites });

        hasFetchedRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, token, setUser]);
}
