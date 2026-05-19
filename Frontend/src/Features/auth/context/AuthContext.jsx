
import React, { createContext, useContext, useEffect, useState } from "react";
import { getme } from "../../auth/services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // ================= LOAD USER =================
  const loadUser = async () => {
    try {
      setLoading(true);

      const res = await getme();

      if (res?.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ================= REFRESH USER =================
  const refreshUser = async () => {
    await loadUser();
  };

  // ================= CONTEXT VALUE =================
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authChecked,
        loadUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};