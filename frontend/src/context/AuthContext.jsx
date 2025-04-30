import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Dummy test account
const TEST_ACCOUNT = {
  email: 'test@example.com',
  password: 'test123',
  name: 'Test User'
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      // Check if credentials match test account
      if (email === TEST_ACCOUNT.email && password === TEST_ACCOUNT.password) {
        const user = {
          id: '1',
          email: TEST_ACCOUNT.email,
          name: TEST_ACCOUNT.name
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 