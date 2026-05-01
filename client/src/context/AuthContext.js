import { createContext, useContext, useState } from 'react';
import { getToken, removeToken, saveToken } from '../utils/authToken';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  });

  function login(userData, jwtToken) {
    saveToken(jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
  }

  function signup(userData, jwtToken) {
    login(userData, jwtToken);
  }

  function logout() {
    removeToken();
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  const value = {
    user,
    token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
