import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  getSessionUser,
  onAuthStateChange,
  signIn as signInService,
  signOut as signOutService,
  signUp as signUpService,
} from '@/api/authService';

interface AuthUser {
  id: string;
  email: string | null;
  name?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signUpInProgress: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signUpInProgress, setSignUpInProgress] = useState(false);
  const signUpInProgressRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const userData = await getSessionUser();
      if (!mounted) return;
      setUser(userData);
      setLoading(false);
    };

    loadSession();

    const unsubscribe = onAuthStateChange((userData) => {
      if (!mounted) return;
      if (signUpInProgressRef.current) return;
      setUser(userData);
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await signInService(email, password);
  };

  const signUp = async (name: string, email: string, password: string) => {
    setSignUpInProgress(true);
    signUpInProgressRef.current = true;
    const error = await signUpService(name, email, password);
    if (!error) {
      setUser(null);
    }
    setSignUpInProgress(false);
    signUpInProgressRef.current = false;
    return error;
  };

  const signOut = async () => {
    await signOutService();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signUpInProgress, signIn, signUp, signOut }),
    [user, loading, signUpInProgress],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
