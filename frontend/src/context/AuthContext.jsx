import React from "react";
import { createContext, useContext, useState } from "react";

// Context create
const AuthContext = createContext();

// Hook
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  // user = { id, role }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
