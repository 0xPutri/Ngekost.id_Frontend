import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, getTokens, setTokens, clearTokens } from "./api";

const NgekostAuthContext = createContext(null);

export function NgekostAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchProfile = useCallback(async () => {
    const tokens = getTokens();
    if (!tokens?.access) {
      setIsLoading(false);
      return;
    }
    try {
      const profile = await api.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (username, password) => {
    const data = await api.login({ username, password });
    setTokens(data);
    const profile = await api.getProfile();
    setUser(profile);
    setIsAuthenticated(true);
    return profile;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    return data;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <NgekostAuthContext.Provider value={{ user, isLoading, isAuthenticated, login, register, logout, fetchProfile }}>
      {children}
    </NgekostAuthContext.Provider>
  );
}

export function useNgekostAuth() {
  const ctx = useContext(NgekostAuthContext);
  if (!ctx) throw new Error("useNgekostAuth must be used inside NgekostAuthProvider");
  return ctx;
}
