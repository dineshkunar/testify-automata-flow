
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'tester';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, role?: 'admin' | 'tester') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Mock user - since we're removing auth, we'll have a default user
  const [user] = useState<User>({
    id: 'mock-user-id',
    username: 'TestUser',
    role: 'admin'
  });
  const [loading] = useState(false);

  const login = async (): Promise<boolean> => {
    return true;
  };

  const signup = async (): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    // No-op since we're removing auth
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
