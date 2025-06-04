import { useEffect, useRef } from "react";
import useAuthStore from "../store/authStore";

export default function useFetchSizes() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const userId = useAuthStore((s) => s.user?._id);
  const setUser = useAuthStore((s) => s.setUser);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn || !userId || hasFetchedRef.current) return;

    const fetchSizes = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/users/${userId}/sizes`
        );
        const sizes = await res.json();

        setUser((prevUser) => ({
          ...(prevUser || {}),
          settings: {
            ...(prevUser?.settings || {}),
            sizes,
          },
        }));

        console.log("🧠 Updated Zustand with sizes:", sizes);

        hasFetchedRef.current = true;
      } catch (err) {
        console.error("❌ Error fetching user sizes:", err);
      }
    };

    fetchSizes();
  }, [isLoggedIn, userId]);
}
