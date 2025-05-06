import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('sleepTrackerUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register function
  const register = (email, password, name) => {
    // In a real app, this would communicate with a backend API
    const newUser = { id: Date.now().toString(), email, name };
    setCurrentUser(newUser);
    localStorage.setItem('sleepTrackerUser', JSON.stringify(newUser));
    return Promise.resolve(newUser);
  };

  // Login function
  const login = (email, password) => {
    // In a real app, this would verify credentials with a backend API
    const user = { id: '123', email, name: 'Demo User' };
    setCurrentUser(user);
    localStorage.setItem('sleepTrackerUser', JSON.stringify(user));
    return Promise.resolve(user);
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sleepTrackerUser');
    return Promise.resolve();
  };

  // Update user profile
  const updateProfile = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem('sleepTrackerUser', JSON.stringify(updatedUser));
    return Promise.resolve(updatedUser);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
