import { createContext, useContext, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("tuktuk_user");
    return stored ? JSON.parse(stored) : null;
  });

  async function signIn(username, password) {
    const { token, user } = await api.signIn(username, password);
    localStorage.setItem("tuktuk_token", token);
    localStorage.setItem("tuktuk_user", JSON.stringify(user));
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem("tuktuk_token");
    localStorage.removeItem("tuktuk_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
