import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('learnhub_theme');
    if (saved) return saved === 'dark';
    return true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'dark');
    localStorage.setItem('learnhub_theme', dark ? 'dark' : 'light');
  }, [dark]);

  function toggle() { setDark(d => !d); }

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() { return useContext(ThemeContext); }
