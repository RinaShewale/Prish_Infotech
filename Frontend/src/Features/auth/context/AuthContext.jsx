import React, { createContext, useContext } from "react";
import { getme } from "../../auth/services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* =========================
     API ONLY (NO STATE HERE)
  ========================= */

  // fetch current user (optional helper)
  const fetchCurrentUser = async () => {
    try {
      const res = await getme();
      return res?.data?.user || null;
    } catch (err) {
      return null;
    }
  };

  /* =========================
     CONTEXT VALUE
  ========================= */
  return (
    <AuthContext.Provider
      value={{
        fetchCurrentUser, // optional helper only
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   CUSTOM HOOK
========================= */
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
};