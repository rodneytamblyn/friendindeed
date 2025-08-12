import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims: Array<{
    typ: string;
    val: string;
  }>;
  identityProvider: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (provider?: 'github' | 'google') => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/.auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (provider: 'github' | 'google' = 'github') => {
    window.location.href = `/.auth/login/${provider}`;
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout, 
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};