import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./authTypes";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      fetch("/api/users/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .then((data) => setUser(data.user))
        .catch(logout);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
