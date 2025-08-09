import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('localvibe_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'Demo User',
      email,
      interests: ['food', 'entertainment', 'shopping'],
      isPremium: false,
      points: 150,
      badges: ['Explorer', 'Reviewer']
    };
    
    setUser(mockUser);
    localStorage.setItem('localvibe_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name,
      email,
      interests: [],
      isPremium: false,
      points: 0,
      badges: ['Newcomer']
    };
    
    setUser(mockUser);
    localStorage.setItem('localvibe_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('localvibe_user');
  };

  return {
    user,
    login,
    register,
    logout,
    loading
  };
};

export { AuthContext }