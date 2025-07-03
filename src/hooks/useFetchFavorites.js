import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export const hasFetchedFavoritesRef = { current: false };

export default function useFetchFavorites() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setFetchedData = useAuthStore((s) => s.setFetchedData);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedFavoritesRef.current) return;

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/favorites`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch favorites");
        }

        const favorites = await res.json();

        setFetchedData({ favorites });

        hasFetchedFavoritesRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, token]);
}
