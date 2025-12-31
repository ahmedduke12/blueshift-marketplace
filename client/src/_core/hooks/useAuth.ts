import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for demo user
    const demoUserStr = localStorage.getItem("demo-user");
    if (demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr);
        setUser(demoUser);
      } catch (e) {
        console.error("Error parsing demo user:", e);
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("demo-user");
    setUser(null);
    window.location.href = "/";
  };

  return {
    user,
    loading,
    error: null,
    isAuthenticated: Boolean(user),
    refresh: () => {
      const demoUserStr = localStorage.getItem("demo-user");
      if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
      }
    },
    logout
  };
}
