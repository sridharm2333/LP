import React, { createContext, useContext, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'midnight';

type ThemeContextType = {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  toggleMidnightOcean: () => void;
  colors: typeof lightColors | typeof midnightColors;
};

const lightColors = {
  background: '#f0f4f8',
  surface: '#ffffff',
  text: '#1a202c',
  textSecondary: '#718096',
  primary: '#2b6cb0',
  warmth: '#c53030',
  border: '#e2e8f0',
};

const midnightColors = {
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  primary: '#38bdf8',
  warmth: '#fb7185',
  border: '#334155',
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);
  const toggleMidnightOcean = useCallback(() => {
    setThemeState((prev) => (prev === 'midnight' ? 'light' : 'midnight'));
  }, []);
  const colors = theme === 'midnight' ? midnightColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleMidnightOcean, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
