import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Signup via API
  const signup = async (name, college_email, password) => {
    try {
      const response = await API.post('/auth/signup', { name, college_email, password });
      const { token, _id, role } = response.data;

      localStorage.setItem('token', token);
      const userData = { _id, name, college_email, role };
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Signup failed';
    }
  };

  // Login via API
  const login = async (college_email, password) => {
    try {
      const response = await API.post('/auth/login', { college_email, password });
      const { token, _id, name, role } = response.data;

      localStorage.setItem('token', token);
      const userData = { _id, name, college_email, role };
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    // 1. Wipe tokens and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. Reset local state
    setUser(null);
    setIsAuthenticated(false);
    
    // 3. Forcefully remove Authorization header from Axios
    delete API.defaults.headers.common['Authorization'];
    
    // 4. Hard redirect to the home page to destroy any remaining component state
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
