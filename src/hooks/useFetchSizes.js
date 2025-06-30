import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchSizes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !token || hasFetchedRef.current) return;

    const fetchSizes = async () => {
      try {
        const res = await fetch(`/api/users/sizes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const sizes = await res.json();

        setUser({ sizes });

        hasFetchedRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching user sizes:", err);
      }
    };

    fetchSizes();
  }, [isLoggedIn]);
}
