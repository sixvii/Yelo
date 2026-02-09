import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName?: string;
}

interface Session {
  token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const readJson = async (res: Response) => {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  };

  useEffect(() => {
    // Check for existing session in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setSession({ token });
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        return { error: new Error(data?.message || 'Signup failed') };
      }
      if (!data?.token) {
        return { error: new Error('Signup failed') };
      }
      const nextUser = data.user ?? { id: 'unknown', email, fullName };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setSession({ token: data.token });
      setUser(nextUser);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await readJson(res);
      if (!res.ok) {
        return { error: new Error(data?.message || 'Login failed') };
      }
      if (!data?.token) {
        return { error: new Error('Login failed') };
      }
      const nextUser = data.user ?? { id: 'unknown', email };
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(nextUser));
      setSession({ token: data.token });
      setUser(nextUser);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
