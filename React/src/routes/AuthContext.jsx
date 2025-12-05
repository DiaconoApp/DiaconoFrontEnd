import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ cargo: "MEMBRO" });

  useEffect(() => {
    const savedCargo = localStorage.getItem("cargo");
    if (savedCargo) {
      setUser({ cargo: savedCargo });
    }
  }, []);

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