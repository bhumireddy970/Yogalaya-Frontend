import React, { createContext, useState, useContext } from "react";
import api from "../api/client"; // ✅ import axios client

// Create context
export const AuthContext = createContext();

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ✅ Login with API
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;

    // store token in localStorage
    localStorage.setItem("token", token);
    setUser(user);

    return user;
  };

  // ✅ Register with API
  const register = async (name, email, password) => {
    const res = await api.post("/register", { name, email, password });
    return res.data; // { msg: "...", user: ... } (depends on backend)
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  return useContext(AuthContext);
}
