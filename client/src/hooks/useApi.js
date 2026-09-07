import { useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function useApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (input, options = {}) => {
    if (!isLoaded) {
      return Promise.reject(new Error("Clerk is still loading"));
    }

    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return Promise.reject(new Error("Unauthorized"));
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(input, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      if (res.status === 401) {
        window.location.href = "/sign-in";
        throw new Error("Unauthorized");
      }

      if (!res.ok) {
        const text = await res.text();
        let err;
        try {
          err = JSON.parse(text);
        } catch {
          err = { message: text || res.statusText };
        }
        throw new Error(err.message || err.error || "Request failed");
      }

      if (res.status === 204) return null;
      return res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  return { request, loading, error };
}
