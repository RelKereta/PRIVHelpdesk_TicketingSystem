import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Test accounts with different roles
const TEST_ACCOUNTS = [
  {
    id: '1',
    email: 'admin@priv.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    isActive: true,
    permissions: ['user_management', 'ticket_management', 'system_settings', 'reports', 'audit_logs']
  },
  {
    id: '2',
    email: 'tech@priv.com',
    password: 'tech123',
    name: 'Tech Support',
    role: 'technician',
    department: 'IT Support',
    position: 'Senior Technician',
    isActive: true,
    permissions: ['ticket_assignment', 'ticket_resolution', 'knowledge_base', 'team_chat']
  },
  {
    id: '3',
    email: 'user@priv.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    department: 'Marketing',
    position: 'Marketing Specialist',
    isActive: true,
    permissions: ['ticket_creation', 'ticket_tracking', 'knowledge_base_read']
  }
];

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
      // Check credentials against test accounts
      const account = TEST_ACCOUNTS.find(acc => 
        acc.email === email && acc.password === password && acc.isActive
      );
      
      if (account) {
        const { password: _, ...userWithoutPassword } = account;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const isRole = (role) => {
    return user?.role === role;
  };

  const isAdmin = () => isRole('admin');
  const isTechnician = () => isRole('technician');
  const isUser = () => isRole('user');

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
    isRole,
    isAdmin,
    isTechnician,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 