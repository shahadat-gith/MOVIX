import { createContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, loginUser, registerUser } from "../api/auth";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser()
        .then((res) => {
          setUser(res.user || res.data?.user || null);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    const res = await loginUser(email, password);
    const { token, user: userData } = res;
    if (token) localStorage.setItem("token", token);
    setUser(userData);
    return res;
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    const res = await registerUser(userData);
    const { token, user: userData_ } = res;
    if (token) localStorage.setItem("token", token);
    setUser(userData_);
    return res;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
