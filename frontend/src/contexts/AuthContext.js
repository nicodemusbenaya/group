import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - in real app, this will be API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const loginWithGoogle = async () => {
    // Mock Google login - will be replaced with real integration
    const mockGoogleUser = {
      id: 'google-' + Date.now(),
      email: 'google.user@gmail.com',
      username: 'googleuser',
      name: '',
      birthdate: '',
      role: '',
      skills: [],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Google',
      profileComplete: false
    };
    setUser(mockGoogleUser);
    localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
    return { success: true };
  };

  const register = async (userData) => {
    // Mock register - in real app, this will be API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      name: '',
      birthdate: '',
      role: '',
      skills: [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      profileComplete: false
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const updateProfile = (profileData) => {
    const updatedUser = { 
      ...user, 
      ...profileData, 
      profileComplete: true 
    };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...profileData, profileComplete: true };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      loginWithGoogle,
      register,
      updateProfile,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
