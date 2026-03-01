import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'lonely_penguin_token';

type AuthContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
  loadStoredToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = useCallback(async (t: string | null) => {
    setTokenState(t);
    if (t) await AsyncStorage.setItem(TOKEN_KEY, t);
    else await AsyncStorage.removeItem(TOKEN_KEY);
  }, []);

  const loadStoredToken = useCallback(async () => {
    const stored = await AsyncStorage.getItem(TOKEN_KEY);
    if (stored) setTokenState(stored);
  }, []);

  useEffect(() => {
    loadStoredToken();
  }, [loadStoredToken]);

  return (
    <AuthContext.Provider value={{ token, setToken, loadStoredToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
