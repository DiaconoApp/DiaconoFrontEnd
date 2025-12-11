import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ cargo: localStorage.getItem("cargo") });

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("cargo", newUser.cargo);
  };

  return (
    <AuthContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);