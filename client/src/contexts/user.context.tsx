import errorHandler from '../utils/errorHandler';
import axios from 'axios';
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Provider' | 'Seeker' | 'Admin';
}

interface IAuthContext {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<string>; // Updated type for login
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | null>(null);
const baseUrl = process.env.REACT_APP_SERVER_URL;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { email, password, rememberMe });
      const data = response.data;
      data.userInfo.id = data.userInfo._id;
      localStorage.setItem('token', data.token);
      setUser(data.userInfo);
      return "Login successful";
    } catch (e) {
      return errorHandler(e as Error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
