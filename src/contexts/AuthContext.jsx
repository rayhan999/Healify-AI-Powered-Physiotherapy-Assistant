import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await authService.getCurrentUser(token);
          // Assuming the backend returns the user object directly or nested
          // Adjust based on actual response structure. 
          // If /auth/me returns { user: ... }, use userData.user
          setUser(userData.user || userData); 
        } catch (err) {
          console.error("Session restoration failed", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem("token", data.access_token);
      
      // Verify token and get full user details immediately
      const userData = await authService.getCurrentUser(data.access_token);
      const user = userData.user || userData;
      
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      localStorage.removeItem("token"); // Clean up if verification fails
      throw err;
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      // Registration successful, do not set token or user
      // The component will handle redirection to login
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await authService.logout(token);
      } catch (err) {
        console.error("Logout failed", err);
      }
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
