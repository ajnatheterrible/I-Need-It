import { useEffect } from "react";

export default function useFetchListings(
  searchParams,
  query,
  setListings,
  setCount
) {
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const url = query
          ? `http://localhost:5000/api/listings/feed?${searchParams.toString()}`
          : `http://localhost:5000/api/listings/random`;

        const res = await fetch(url);
        const data = await res.json();

        if (Array.isArray(data)) {
          setListings(data);
          setCount(data.length);
        } else {
          setListings([]);
          setCount(0);
        }
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        setListings([]);
        setCount(0);
      }
    };

    fetchListings();
  }, [searchParams, query, setListings, setCount]);
}
