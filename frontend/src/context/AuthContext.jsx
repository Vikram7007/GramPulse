import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, mobile, role, village }

 const login = (userData, token = null) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
  // token आता cookie मध्ये आहे, localStorage मध्ये नाही
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const loadUser = () => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);