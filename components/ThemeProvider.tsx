'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const themeEvent = 'blog-theme-change';
let fallbackTheme: Theme = 'dark';

function getTheme(): Theme {
  try {
    const saved = window.localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : fallbackTheme;
  } catch {
    return fallbackTheme;
  }
}

function subscribeTheme(notify: () => void) {
  window.addEventListener('storage', notify);
  window.addEventListener(themeEvent, notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener(themeEvent, notify);
  };
}

const getServerTheme = (): Theme => 'dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', getTheme() === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    fallbackTheme = next;
    try { window.localStorage.setItem('theme', next); } catch { /* storage may be disabled */ }
    window.dispatchEvent(new Event(themeEvent));
  };

  // Always provide the context to avoid "useTheme must be used within a ThemeProvider" errors
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
